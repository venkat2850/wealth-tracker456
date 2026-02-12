import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { riskProfiles } from "@/data/sample-data";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, ShieldAlert, User, Mail, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

type RiskLevel = keyof typeof riskProfiles;

const riskIcons = {
  conservative: Shield,
  moderate: ShieldCheck,
  aggressive: ShieldAlert,
};

export default function Profile() {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const [riskProfile, setRiskProfile] = useState<RiskLevel>("moderate");

  useEffect(() => {
    if (profile?.risk_profile) {
      setRiskProfile(profile.risk_profile as RiskLevel);
    }
  }, [profile]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  const kycStatus = profile?.kyc_status ?? "unverified";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account and risk preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{profile?.display_name || "User"}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </div>
          </div>
          <Badge variant={kycStatus === "verified" ? "default" : "secondary"} className="ml-auto">
            <BadgeCheck className="mr-1 h-3 w-3" />
            {kycStatus === "verified" ? "KYC Verified" : "Unverified"}
          </Badge>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-card rounded-xl border border-border p-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Risk Profile</h2>
        <div className="grid gap-3">
          {(Object.keys(riskProfiles) as RiskLevel[]).map((key) => {
            const rp = riskProfiles[key];
            const Icon = riskIcons[key];
            const isSelected = riskProfile === key;
            return (
              <button key={key} onClick={() => setRiskProfile(key)} className={`flex items-start gap-4 rounded-lg border p-4 text-left transition-all ${isSelected ? "border-primary bg-primary/5 animate-glow" : "border-border hover:border-muted-foreground/30"}`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isSelected ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{rp.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rp.description}</p>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="rounded bg-secondary px-2 py-0.5 font-mono text-muted-foreground">Stocks {rp.allocation.stocks}%</span>
                    <span className="rounded bg-secondary px-2 py-0.5 font-mono text-muted-foreground">Bonds {rp.allocation.bonds}%</span>
                    <span className="rounded bg-secondary px-2 py-0.5 font-mono text-muted-foreground">ETFs {rp.allocation.etfs}%</span>
                    <span className="rounded bg-secondary px-2 py-0.5 font-mono text-muted-foreground">Cash {rp.allocation.cash}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <Button
          className="mt-4 w-full"
          disabled={updateProfile.isPending}
          onClick={() => updateProfile.mutate({ risk_profile: riskProfile })}
        >
          {updateProfile.isPending ? "Saving..." : "Save Risk Profile"}
        </Button>
      </motion.div>
    </div>
  );
}
