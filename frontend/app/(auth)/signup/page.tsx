"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { setToken } from "@/lib/auth";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, organisation_name: organisationName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setToken(data.token);
      setUser({
        userId: data.user_id,
        email: data.user_id,
        fullName: fullName,
        organisationName: organisationName,
        plan: data.plan || "free",
        projectsUsed: 0,
      });
      toast.success("Account created! Welcome to ImpactOS AI.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080e0c] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-1">
            <span className="ios-gradient-text">ImpactOS AI</span>
          </div>
          <p className="text-white/50 text-sm">MIS Blueprint in 30 minutes</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-6">
          <h1 className="text-lg font-semibold mb-1">Create your account</h1>
          <p className="text-white/40 text-sm mb-6">Free to get started — no credit card needed.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orgName">Organisation Name</Label>
              <Input
                id="orgName"
                type="text"
                placeholder="Samridhi Foundation"
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="priya@samridhi.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d4aa] text-[#080e0c] hover:bg-[#00d4aa]/90 font-semibold"
            >
              {loading ? "Creating account..." : "Create free account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-white/50 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00d4aa] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
