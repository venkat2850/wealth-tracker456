import { Goal } from "@/data/sample-data";
import { Target, Home, GraduationCap, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const goalIcons = {
  retirement: Target,
  home: Home,
  education: GraduationCap,
  custom: Sparkles,
};

const goalColors = {
  retirement: "text-primary",
  home: "text-info",
  education: "text-warning",
  custom: "text-muted-foreground",
};

interface GoalCardProps {
  goal: Goal;
  index: number;
}

export function GoalCard({ goal, index }: GoalCardProps) {
  const Icon = goalIcons[goal.type];
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const colorClass = goalColors[goal.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="gradient-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-secondary ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{goal.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">{goal.type}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono font-medium text-foreground">{progress.toFixed(1)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        <div className="flex justify-between text-xs">
          <span className="font-mono text-muted-foreground">
            ${goal.currentAmount.toLocaleString()}
          </span>
          <span className="font-mono text-foreground">
            ${goal.targetAmount.toLocaleString()}
          </span>
        </div>
        <div className="pt-2 border-t border-border flex justify-between text-xs text-muted-foreground">
          <span>${goal.monthlyContribution.toLocaleString()}/mo</span>
          <span>Target: {new Date(goal.targetDate).getFullYear()}</span>
        </div>
      </div>
    </motion.div>
  );
}
