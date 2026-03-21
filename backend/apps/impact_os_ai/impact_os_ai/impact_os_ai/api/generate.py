import frappe
from frappe import _
from .auth import get_current_user_from_token
import json
import openai


# ---------------------------------------------------------------------------
# MAP Framework section definitions
# ---------------------------------------------------------------------------

MAP_SECTIONS = {
    "mission_vision": {
        "label": "Mission & Vision",
        "prompt_key": "mission_vision",
        "order": 1,
    },
    "theory_of_change": {
        "label": "Theory of Change",
        "prompt_key": "theory_of_change",
        "order": 2,
    },
    "logframe": {
        "label": "Logical Framework (LogFrame)",
        "prompt_key": "logframe",
        "order": 3,
    },
    "stakeholder_map": {
        "label": "Stakeholder Map",
        "prompt_key": "stakeholder_map",
        "order": 4,
    },
    "indicators": {
        "label": "Impact Indicators & KPIs",
        "prompt_key": "indicators",
        "order": 5,
    },
    "data_collection": {
        "label": "Data Collection Plan",
        "prompt_key": "data_collection",
        "order": 6,
    },
    "budget_narrative": {
        "label": "Budget Narrative",
        "prompt_key": "budget_narrative",
        "order": 7,
    },
    "risk_matrix": {
        "label": "Risk Matrix",
        "prompt_key": "risk_matrix",
        "order": 8,
    },
    "evaluation_plan": {
        "label": "Evaluation Plan",
        "prompt_key": "evaluation_plan",
        "order": 9,
    },
    "sustainability": {
        "label": "Sustainability Plan",
        "prompt_key": "sustainability",
        "order": 10,
    },
}

VALID_SECTIONS = set(MAP_SECTIONS.keys())


def _get_openai_client():
    api_key = frappe.conf.get("openai_api_key", "")
    if not api_key:
        frappe.throw(_("OpenAI API key is not configured"), frappe.ConfigurationError)
    return openai.OpenAI(api_key=api_key)


def _build_system_prompt(project_doc) -> str:
    return (
        "You are an expert impact measurement consultant specializing in the MAP Framework "
        "(Mission-Aligned Planning). You help NGOs, social enterprises, and development organizations "
        "create rigorous, donor-ready MIS blueprints. Always respond with structured, professional content "
        "suitable for grant applications and impact reports. Use clear headings, bullet points where appropriate, "
        "and be specific and actionable.\n\n"
        f"Project Context:\n"
        f"- Organization: {project_doc.organization}\n"
        f"- Project Title: {project_doc.project_title}\n"
        f"- Sector: {project_doc.sector}\n"
        f"- Country/Region: {project_doc.country or 'Not specified'}\n"
        f"- Budget (USD): {project_doc.budget_usd or 'Not specified'}\n"
        f"- Duration: {project_doc.duration_months or 12} months\n"
        f"- Target Beneficiaries: {project_doc.target_beneficiaries or 'Not specified'}\n"
        f"- SDG Goals: {project_doc.sdg_goals or 'Not specified'}\n"
        f"- Description: {project_doc.description or 'Not provided'}\n"
    )


def _build_section_prompt(section_key: str, project_doc) -> str:
    prompts = {
        "mission_vision": (
            "Generate a compelling Mission Statement and Vision Statement for this project. "
            "The mission should describe what the organization does, for whom, and how. "
            "The vision should describe the long-term change or world you are working toward. "
            "Format with clear 'Mission:' and 'Vision:' headings. Keep each to 2-3 sentences."
        ),
        "theory_of_change": (
            "Develop a comprehensive Theory of Change for this project following the standard format: "
            "Inputs → Activities → Outputs → Outcomes → Impact. "
            "For each level, list 3-5 specific items. Then write a narrative paragraph explaining the causal logic. "
            "Include key assumptions and enabling conditions."
        ),
        "logframe": (
            "Create a Logical Framework Matrix (LogFrame) with the following columns: "
            "Intervention Logic, Objectively Verifiable Indicators (OVIs), Means of Verification (MOV), Assumptions. "
            "Include rows for: Overall Goal (Impact), Specific Objective (Outcome), Outputs (3-4), and Key Activities (3-5 per output). "
            "Format as a structured table description."
        ),
        "stakeholder_map": (
            "Identify and map all key stakeholders for this project. For each stakeholder, provide: "
            "Name/Group, Role/Interest, Influence Level (High/Medium/Low), Engagement Strategy. "
            "Group them into: Primary Beneficiaries, Implementing Partners, Funders/Donors, Government Bodies, "
            "Private Sector, Civil Society. Include at least 8-10 stakeholders total."
        ),
        "indicators": (
            "Develop a comprehensive set of SMART impact indicators and KPIs for this project. "
            "Include: 3-4 Impact indicators, 4-5 Outcome indicators, 5-6 Output indicators, 3-4 Process indicators. "
            "For each indicator, specify: Indicator name, Definition, Baseline, Target, Frequency of measurement, "
            "Disaggregation (gender, age, location as relevant). Align with standard frameworks (SDGs, IRIS+)."
        ),
        "data_collection": (
            "Design a detailed Data Collection Plan for this project. Include: "
            "Data collection methods (surveys, FGDs, KIIs, observation, administrative records), "
            "Tools and instruments needed, Responsible parties, Timeline/frequency, "
            "Data management and storage approach, Quality assurance measures, "
            "Ethical considerations including consent and confidentiality. "
            "Map each method to the indicators defined for the project."
        ),
        "budget_narrative": (
            "Write a detailed budget narrative for this project. Include the following budget categories: "
            "Personnel (staff salaries and benefits), Consultants and technical assistance, "
            "Training and capacity building, Equipment and supplies, Travel and transportation, "
            "Communications and outreach, Monitoring and evaluation, Indirect/overhead costs. "
            f"Base the narrative on a total budget of approximately USD {project_doc.budget_usd or 'the specified amount'}. "
            "Justify each line item and explain how it contributes to project outcomes."
        ),
        "risk_matrix": (
            "Create a comprehensive Risk Matrix for this project. For each risk, include: "
            "Risk description, Category (Financial/Operational/Political/Environmental/Social/Reputational), "
            "Likelihood (1-5), Impact (1-5), Risk Score, Mitigation Strategy, Contingency Plan, Risk Owner. "
            "Include at least 10-12 risks covering different categories. "
            "Prioritize risks by score and provide a risk register summary."
        ),
        "evaluation_plan": (
            "Develop a comprehensive Evaluation Plan including: "
            "Evaluation purpose and questions (at least 5 key evaluation questions), "
            "Evaluation design (baseline, midline, endline), "
            "Methodology mix (quantitative and qualitative), "
            "Sampling strategy and sample sizes, "
            "Data analysis approach, "
            "Reporting schedule and dissemination plan, "
            "Budget allocation for M&E (typically 5-10% of total budget), "
            "Learning and adaptive management approach."
        ),
        "sustainability": (
            "Create a Sustainability Plan addressing how the project's impact will continue after funding ends. "
            "Include: Financial sustainability (revenue models, diversified funding), "
            "Institutional sustainability (local ownership, capacity building), "
            "Technical sustainability (knowledge transfer, local expertise), "
            "Social sustainability (community ownership, behavior change), "
            "Environmental sustainability (if applicable), "
            "Exit strategy and transition plan. "
            "Be specific about timelines and responsible parties."
        ),
    }
    return prompts.get(section_key, f"Generate content for the {section_key} section of this project.")


@frappe.whitelist(allow_guest=True)
def generate_section(slug: str, section: str):
    """
    Generate a specific MAP section for a project using OpenAI.
    POST /api/method/impact_os_ai.impact_os_ai.api.generate.generate_section
    """
    user_email = get_current_user_from_token()

    if section not in VALID_SECTIONS:
        frappe.throw(
            _("Invalid section '{0}'. Valid sections: {1}").format(section, ", ".join(sorted(VALID_SECTIONS))),
            frappe.ValidationError,
        )

    if not frappe.db.exists("IOS Project", {"slug": slug}):
        frappe.throw(_("Project not found"), frappe.DoesNotExistError)

    project_doc = frappe.get_doc("IOS Project", {"slug": slug})

    if project_doc.owner != user_email and not _is_admin(user_email):
        frappe.throw(_("Not authorized to modify this project"), frappe.PermissionError)

    _check_and_deduct_credit(user_email)

    client = _get_openai_client()
    system_prompt = _build_system_prompt(project_doc)
    user_prompt = _build_section_prompt(section, project_doc)

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        content = response.choices[0].message.content
    except openai.APIError as e:
        frappe.log_error(f"OpenAI API error: {str(e)}", "ImpactOS Generate Section")
        frappe.throw(_("AI generation failed. Please try again later."), frappe.ValidationError)

    # Persist the generated section
    sections = {}
    if project_doc.generated_sections:
        try:
            sections = json.loads(project_doc.generated_sections)
        except Exception:
            sections = {}

    sections[section] = {
        "label": MAP_SECTIONS[section]["label"],
        "content": content,
        "generated_at": str(frappe.utils.now_datetime()),
    }

    project_doc.generated_sections = json.dumps(sections)
    if project_doc.status == "draft":
        project_doc.status = "in_progress"
    project_doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {
        "slug": slug,
        "section": section,
        "label": MAP_SECTIONS[section]["label"],
        "content": content,
    }


@frappe.whitelist(allow_guest=True)
def generate_all_sections(slug: str):
    """
    Generate all MAP sections for a project sequentially.
    POST /api/method/impact_os_ai.impact_os_ai.api.generate.generate_all_sections
    """
    user_email = get_current_user_from_token()

    if not frappe.db.exists("IOS Project", {"slug": slug}):
        frappe.throw(_("Project not found"), frappe.DoesNotExistError)

    project_doc = frappe.get_doc("IOS Project", {"slug": slug})

    if project_doc.owner != user_email and not _is_admin(user_email):
        frappe.throw(_("Not authorized to modify this project"), frappe.PermissionError)

    results = {}
    errors = {}

    for section_key in sorted(MAP_SECTIONS.keys(), key=lambda k: MAP_SECTIONS[k]["order"]):
        try:
            result = generate_section(slug=slug, section=section_key)
            results[section_key] = result
        except Exception as e:
            errors[section_key] = str(e)

    return {
        "slug": slug,
        "generated": list(results.keys()),
        "errors": errors,
        "total_generated": len(results),
    }


@frappe.whitelist(allow_guest=True)
def regenerate_section(slug: str, section: str, feedback: str = ""):
    """
    Regenerate a section with optional user feedback.
    POST /api/method/impact_os_ai.impact_os_ai.api.generate.regenerate_section
    """
    user_email = get_current_user_from_token()

    if section not in VALID_SECTIONS:
        frappe.throw(_("Invalid section '{0}'").format(section), frappe.ValidationError)

    if not frappe.db.exists("IOS Project", {"slug": slug}):
        frappe.throw(_("Project not found"), frappe.DoesNotExistError)

    project_doc = frappe.get_doc("IOS Project", {"slug": slug})

    if project_doc.owner != user_email and not _is_admin(user_email):
        frappe.throw(_("Not authorized to modify this project"), frappe.PermissionError)

    _check_and_deduct_credit(user_email)

    client = _get_openai_client()
    system_prompt = _build_system_prompt(project_doc)
    base_prompt = _build_section_prompt(section, project_doc)

    if feedback:
        user_prompt = (
            f"{base_prompt}\n\n"
            f"The user has provided the following feedback on the previous version:\n{feedback}\n"
            "Please incorporate this feedback and improve the output accordingly."
        )
    else:
        user_prompt = base_prompt + "\n\nPlease provide an alternative, improved version."

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.8,
            max_tokens=2000,
        )
        content = response.choices[0].message.content
    except openai.APIError as e:
        frappe.log_error(f"OpenAI API error: {str(e)}", "ImpactOS Regenerate Section")
        frappe.throw(_("AI generation failed. Please try again later."), frappe.ValidationError)

    sections = {}
    if project_doc.generated_sections:
        try:
            sections = json.loads(project_doc.generated_sections)
        except Exception:
            sections = {}

    sections[section] = {
        "label": MAP_SECTIONS[section]["label"],
        "content": content,
        "generated_at": str(frappe.utils.now_datetime()),
        "regenerated": True,
    }

    project_doc.generated_sections = json.dumps(sections)
    project_doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {
        "slug": slug,
        "section": section,
        "label": MAP_SECTIONS[section]["label"],
        "content": content,
    }


@frappe.whitelist(allow_guest=True)
def list_sections():
    """
    List all available MAP sections.
    GET /api/method/impact_os_ai.impact_os_ai.api.generate.list_sections
    """
    sections = [
        {"key": k, "label": v["label"], "order": v["order"]}
        for k, v in sorted(MAP_SECTIONS.items(), key=lambda x: x[1]["order"])
    ]
    return {"sections": sections}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _check_and_deduct_credit(user_email: str):
    """Check and deduct one generation credit from the user's profile."""
    if not frappe.db.exists("IOS User Profile", {"user": user_email}):
        frappe.throw(_("User profile not found"), frappe.DoesNotExistError)

    profile = frappe.get_doc("IOS User Profile", {"user": user_email})

    if profile.credits_used >= profile.credits_limit:
        frappe.throw(
            _("You have used all {0} generation credits for your {1} plan. Please upgrade.").format(
                profile.credits_limit, profile.subscription_tier
            ),
            frappe.ValidationError,
        )

    profile.credits_used = (profile.credits_used or 0) + 1
    profile.save(ignore_permissions=True)
    frappe.db.commit()


def _is_admin(user_email: str) -> bool:
    return "System Manager" in frappe.get_roles(user_email)
