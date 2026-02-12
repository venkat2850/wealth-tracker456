import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Goals() {
  const { goals, isLoading, createGoal, deleteGoal } = useGoals();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "custom",
    targetAmount: "",
    monthlyContribution: "",
    targetDate: "",
  });

  const handleCreate = () => {
    if (!form.name || !form.targetAmount || !form.targetDate) return;
    createGoal.mutate(
      {
        name: form.name,
        type: form.type,
        target_amount: Number(form.targetAmount),
        monthly_contribution: Number(form.monthlyContribution) || 0,
        target_date: form.targetDate,
      },
      {
        onSuccess: () => {
          setForm({ name: "", type: "custom", targetAmount: "", monthlyContribution: "", targetDate: "" });
          setOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Financial Goals</h1>
          <p className="text-sm text-muted-foreground">Track and manage your financial targets</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground">Goal Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Vacation Fund" className="bg-secondary border-border" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Target Amount</Label>
                  <Input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="100000" className="bg-secondary border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Monthly Contribution</Label>
                  <Input type="number" value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })} placeholder="500" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground">Target Date</Label>
                <Input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="bg-secondary border-border" />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createGoal.isPending}>
                {createGoal.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <div className="gradient-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No goals yet. Create your first financial goal!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal, i) => (
            <div key={goal.id} className="relative group">
              <GoalCard
                goal={{
                  id: goal.id,
                  name: goal.name,
                  type: goal.type as any,
                  targetAmount: Number(goal.target_amount),
                  currentAmount: Number(goal.current_amount),
                  monthlyContribution: Number(goal.monthly_contribution),
                  targetDate: goal.target_date,
                  createdAt: goal.created_at,
                }}
                index={i}
              />
              <button
                onClick={() => deleteGoal.mutate(goal.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-destructive hover:text-destructive/80"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
