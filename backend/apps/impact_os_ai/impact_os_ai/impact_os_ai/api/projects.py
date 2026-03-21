import frappe
from frappe import _
from .auth import get_current_user_from_token
import json


@frappe.whitelist(allow_guest=True)
def list_projects():
    """
    List all projects for the current user.
    GET /api/method/impact_os_ai.impact_os_ai.api.projects.list_projects
    """
    user_email = get_current_user_from_token()

    projects = frappe.get_all(
        "IOS Project",
        filters={"owner": user_email},
        fields=[
            "name", "project_title", "slug", "organization", "sector",
            "status", "creation", "modified", "description",
        ],
        order_by="modified desc",
    )

    return {"projects": projects, "total": len(projects)}


@frappe.whitelist(allow_guest=True)
def get_project(slug: str):
    """
    Get a single project by slug.
    GET /api/method/impact_os_ai.impact_os_ai.api.projects.get_project?slug=xxx
    """
    user_email = get_current_user_from_token()

    if not frappe.db.exists("IOS Project", {"slug": slug}):
        frappe.throw(_("Project not found"), frappe.DoesNotExistError)

    doc = frappe.get_doc("IOS Project", {"slug": slug})

    if doc.owner != user_email and not _is_admin(user_email):
        frappe.throw(_("Not authorized to view this project"), frappe.PermissionError)

    return _serialize_project(doc)


@frappe.whitelist(allow_guest=True)
def create_project(
    project_title: str,
    organization: str,
    sector: str,
    description: str = "",
    country: str = "",
    budget_usd: float = 0,
    duration_months: int = 12,
    target_beneficiaries: int = 0,
    sdg_goals: str = "",
):
    """
    Create a new IOS Project.
    POST /api/method/impact_os_ai.impact_os_ai.api.projects.create_project
    """
    user_email = get_current_user_from_token()

    _check_project_limit(user_email)

    doc = frappe.get_doc({
        "doctype": "IOS Project",
        "project_title": project_title,
        "organization": organization,
        "sector": sector,
        "description": description,
        "country": country,
        "budget_usd": budget_usd,
        "duration_months": duration_months,
        "target_beneficiaries": target_beneficiaries,
        "sdg_goals": sdg_goals,
        "status": "draft",
        "owner": user_email,
    })
    doc.insert(ignore_permissions=True)
    frappe.db.commit()

    return _serialize_project(doc)


@frappe.whitelist(allow_guest=True)
def update_project(slug: str, **kwargs):
    """
    Update an existing project.
    PUT /api/method/impact_os_ai.impact_os_ai.api.projects.update_project
    """
    user_email = get_current_user_from_token()

    if not frappe.db.exists("IOS Project", {"slug": slug}):
        frappe.throw(_("Project not found"), frappe.DoesNotExistError)

    doc = frappe.get_doc("IOS Project", {"slug": slug})

    if doc.owner != user_email and not _is_admin(user_email):
        frappe.throw(_("Not authorized to modify this project"), frappe.PermissionError)

    allowed_fields = [
        "project_title", "organization", "sector", "description",
        "country", "budget_usd", "duration_months", "target_beneficiaries",
        "sdg_goals", "status",
    ]

    # Handle JSON body passed as string
    if isinstance(kwargs.get("data"), str):
        try:
            data = json.loads(kwargs["data"])
        except Exception:
            data = kwargs
    else:
        data = kwargs

    for field in allowed_fields:
        if field in data:
            doc.set(field, data[field])

    doc.save(ignore_permissions=True)
    frappe.db.commit()

    return _serialize_project(doc)


@frappe.whitelist(allow_guest=True)
def delete_project(slug: str):
    """
    Delete a project by slug.
    DELETE /api/method/impact_os_ai.impact_os_ai.api.projects.delete_project
    """
    user_email = get_current_user_from_token()

    if not frappe.db.exists("IOS Project", {"slug": slug}):
        frappe.throw(_("Project not found"), frappe.DoesNotExistError)

    doc = frappe.get_doc("IOS Project", {"slug": slug})

    if doc.owner != user_email and not _is_admin(user_email):
        frappe.throw(_("Not authorized to delete this project"), frappe.PermissionError)

    doc.delete(ignore_permissions=True)
    frappe.db.commit()

    return {"message": "Project deleted successfully"}


@frappe.whitelist(allow_guest=True)
def get_project_sections(slug: str):
    """
    Get generated MAP sections for a project.
    GET /api/method/impact_os_ai.impact_os_ai.api.projects.get_project_sections
    """
    user_email = get_current_user_from_token()

    if not frappe.db.exists("IOS Project", {"slug": slug}):
        frappe.throw(_("Project not found"), frappe.DoesNotExistError)

    doc = frappe.get_doc("IOS Project", {"slug": slug})

    if doc.owner != user_email and not _is_admin(user_email):
        frappe.throw(_("Not authorized to view this project"), frappe.PermissionError)

    sections = {}
    if doc.generated_sections:
        try:
            sections = json.loads(doc.generated_sections)
        except Exception:
            sections = {}

    return {"slug": slug, "sections": sections}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _serialize_project(doc) -> dict:
    sections = {}
    if doc.generated_sections:
        try:
            sections = json.loads(doc.generated_sections)
        except Exception:
            sections = {}

    return {
        "name": doc.name,
        "slug": doc.slug,
        "project_title": doc.project_title,
        "organization": doc.organization,
        "sector": doc.sector,
        "description": doc.description,
        "country": doc.country,
        "budget_usd": doc.budget_usd,
        "duration_months": doc.duration_months,
        "target_beneficiaries": doc.target_beneficiaries,
        "sdg_goals": doc.sdg_goals,
        "status": doc.status,
        "sections": sections,
        "created_at": str(doc.creation),
        "updated_at": str(doc.modified),
    }


def _check_project_limit(user_email: str):
    """Enforce per-tier project limits."""
    tier = "free"
    if frappe.db.exists("IOS User Profile", {"user": user_email}):
        tier = frappe.db.get_value("IOS User Profile", {"user": user_email}, "subscription_tier") or "free"

    limits = {"free": 3, "starter": 10, "pro": 50, "enterprise": 999}
    limit = limits.get(tier, 3)

    count = frappe.db.count("IOS Project", filters={"owner": user_email})
    if count >= limit:
        frappe.throw(
            _("Project limit reached for your {0} plan. Please upgrade to create more projects.").format(tier),
            frappe.ValidationError,
        )


def _is_admin(user_email: str) -> bool:
    return "System Manager" in frappe.get_roles(user_email)
