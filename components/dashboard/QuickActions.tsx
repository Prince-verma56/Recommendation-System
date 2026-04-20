"use client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";
import { Settings, LineChart, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function QuickActions() {
  const { user } = useUser();
  const router = useRouter();
  const seedDemoData = useMutation(api.seed.seedDemoData);

  const handleReset = async () => {
    if (!user?.id) return;
    const toastId = toast.loading("Resetting behavioral fingerprint...");
    try {
      await seedDemoData({ userId: user.id });
      toast.dismiss(toastId);
      toast.success("Behavioral history reset and re-seeded");
    } catch (e) {
      toast.dismiss(toastId);
      toast.error("Failed to seed data");
    }
  };

  const actions = [
    { label: "Switch Persona", icon: Settings, onClick: () => router.push("/profile"), color: "#0071e3" },
    { label: "View Analytics", icon: LineChart, onClick: () => router.push("/analytics"), color: "#0071e3" },
    { label: "Clear Matrix", icon: RotateCcw, onClick: handleReset, color: "#ff453a" },
  ];

  return (
    <AppCard className="col-span-12 md:col-span-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Settings size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Quick Actions</h3>
      </div>
      
      <div className="space-y-2">
        {actions.map((act) => (
          <button
            key={act.label}
            onClick={act.onClick}
            className="w-full flex items-center justify-between p-3 bg-zinc-800/20 border border-zinc-700/20 rounded-xl hover:bg-zinc-800/40 transition-all group"
          >
            <span className="text-[11px] font-bold text-white/80 group-hover:text-white">{act.label}</span>
            <div className="p-1.5 rounded-lg bg-zinc-900 overflow-hidden">
              <act.icon size={13} style={{ color: act.color }} />
            </div>
          </button>
        ))}
      </div>
    </AppCard>
  );
}

