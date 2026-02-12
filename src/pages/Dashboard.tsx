import { DollarSign, TrendingUp, Target, PieChart } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { GoalCard } from "@/components/GoalCard";
import { useGoals } from "@/hooks/useGoals";
import { useHoldings } from "@/hooks/useHoldings";
import {
  sampleHoldings,
  sampleGoals,
  netWorthHistory,
  allocationData,
} from "@/data/sample-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { goals: dbGoals } = useGoals();
  const { holdings: dbHoldings } = useHoldings();

  const holdingsForCalc = dbHoldings.length > 0
    ? dbHoldings.map(h => ({ units: Number(h.units), currentPrice: Number(h.current_price), avgBuyPrice: Number(h.avg_buy_price) }))
    : sampleHoldings;

  const goals = dbGoals.length > 0
    ? dbGoals.map(g => ({ id: g.id, name: g.name, type: g.type as any, targetAmount: Number(g.target_amount), currentAmount: Number(g.current_amount), monthlyContribution: Number(g.monthly_contribution), targetDate: g.target_date, createdAt: g.created_at }))
    : sampleGoals;

  const totalValue = holdingsForCalc.reduce((sum, h) => sum + h.units * h.currentPrice, 0);
  const totalCost = holdingsForCalc.reduce((sum, h) => sum + h.units * h.avgBuyPrice, 0);
  const totalGain = totalValue - totalCost;
  const gainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your wealth at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Net Worth" value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} change={`+$${totalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${gainPct}%)`} changeType="positive" icon={DollarSign} />
        <StatCard title="Monthly Growth" value="+$4,320" change="+2.8% vs last month" changeType="positive" icon={TrendingUp} />
        <StatCard title="Active Goals" value={String(goals.length)} change={goals.length > 0 ? "Tracking progress" : "None yet"} changeType="neutral" icon={Target} />
        <StatCard title="Portfolio Items" value={String(holdingsForCalc.length)} change="Overview" changeType="neutral" icon={PieChart} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gradient-card rounded-xl border border-border p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Net Worth Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={netWorthHistory}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152, 60%, 48%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(152, 60%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'hsl(222, 44%, 8%)', border: '1px solid hsl(222, 20%, 16%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)', fontSize: 12 }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']} />
              <Area type="monotone" dataKey="value" stroke="hsl(152, 60%, 48%)" fill="url(#netWorthGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="gradient-card rounded-xl border border-border p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {allocationData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(222, 44%, 8%)', border: '1px solid hsl(222, 20%, 16%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)', fontSize: 12 }} formatter={(value: number) => [`${value}%`]} />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-mono text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Financial Goals</h2>
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No goals yet. Create one from the Goals page.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {goals.slice(0, 4).map((goal, i) => (
              <GoalCard key={goal.id} goal={goal} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
