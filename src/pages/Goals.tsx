import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Goals() {
  const { goals, isLoading, createGoal, updateGoal, deleteGoal } = useGoals();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editGoal, setEditGoal] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", type: "custom", targetAmount: "", monthlyContribution: "", targetDate: "",
  });

  const handleCreate = () => {
    if (!form.name || !form.targetAmount || !form.targetDate) return;
    createGoal.mutate({
      name: form.name, type: form.type, target_amount: Number(form.targetAmount),
      monthly_contribution: Number(form.monthlyContribution) || 0, target_date: form.targetDate,
    }, {
      onSuccess: () => {
        setForm({ name: "", type: "custom", targetAmount: "", monthlyContribution: "", targetDate: "" });
        setOpen(false);
      },
    });
  };

  const handleUpdate = () => {
    if (!editGoal) return;
    updateGoal.mutate({
      id: editGoal.id, name: editGoal.name, type: editGoal.type,
      target_amount: Number(editGoal.target_amount), current_amount: Number(editGoal.current_amount),
      monthly_contribution: Number(editGoal.monthly_contribution), target_date: editGoal.target_date,
    }, {
      onSuccess: () => { setEditOpen(false); setEditGoal(null); },
    });
  };

  const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5"><Label className="text-muted-foreground">{label}</Label>{children}</div>
  );

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
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-foreground">Create New Goal</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <FormField label="Goal Name">
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Vacation Fund" className="bg-secondary border-border" />
              </FormField>
              <FormField label="Type">
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Target Amount">
                  <Input type="number" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} placeholder="100000" className="bg-secondary border-border" />
                </FormField>
                <FormField label="Monthly Contribution">
                  <Input type="number" value={form.monthlyContribution} onChange={e => setForm({ ...form, monthlyContribution: e.target.value })} placeholder="500" className="bg-secondary border-border" />
                </FormField>
              </div>
              <FormField label="Target Date">
                <Input type="date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} className="bg-secondary border-border" />
              </FormField>
              <Button onClick={handleCreate} className="w-full" disabled={createGoal.isPending}>
                {createGoal.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Edit Goal</DialogTitle></DialogHeader>
          {editGoal && (
            <div className="space-y-4 pt-2">
              <FormField label="Goal Name">
                <Input value={editGoal.name} onChange={e => setEditGoal({ ...editGoal, name: e.target.value })} className="bg-secondary border-border" />
              </FormField>
              <FormField label="Type">
                <Select value={editGoal.type} onValueChange={v => setEditGoal({ ...editGoal, type: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Target Amount">
                  <Input type="number" value={editGoal.target_amount} onChange={e => setEditGoal({ ...editGoal, target_amount: e.target.value })} className="bg-secondary border-border" />
                </FormField>
                <FormField label="Current Amount">
                  <Input type="number" value={editGoal.current_amount} onChange={e => setEditGoal({ ...editGoal, current_amount: e.target.value })} className="bg-secondary border-border" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Monthly Contribution">
                  <Input type="number" value={editGoal.monthly_contribution} onChange={e => setEditGoal({ ...editGoal, monthly_contribution: e.target.value })} className="bg-secondary border-border" />
                </FormField>
                <FormField label="Target Date">
                  <Input type="date" value={editGoal.target_date} onChange={e => setEditGoal({ ...editGoal, target_date: e.target.value })} className="bg-secondary border-border" />
                </FormField>
              </div>
              <Button onClick={handleUpdate} className="w-full" disabled={updateGoal.isPending}>
                {updateGoal.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete this goal?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The goal and its progress will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteGoal.mutate(deleteId); setDeleteId(null); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  id: goal.id, name: goal.name, type: goal.type as any,
                  targetAmount: Number(goal.target_amount), currentAmount: Number(goal.current_amount),
                  monthlyContribution: Number(goal.monthly_contribution), targetDate: goal.target_date, createdAt: goal.created_at,
                }}
                index={i}
              />
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditGoal(goal); setEditOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(goal.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
