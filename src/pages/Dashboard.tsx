import { DollarSign, TrendingUp, Target, PieChart } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { GoalCard } from "@/components/GoalCard";
import {
  sampleGoals,
  sampleHoldings,
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

const totalValue = sampleHoldings.reduce(
  (sum, h) => sum + h.units * h.currentPrice,
  0
);
const totalCost = sampleHoldings.reduce(
  (sum, h) => sum + h.units * h.avgBuyPrice,
  0
);
const totalGain = totalValue - totalCost;
const gainPct = ((totalGain / totalCost) * 100).toFixed(2);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Your wealth at a glance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Net Worth"
          value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          change={`+$${totalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${gainPct}%)`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Growth"
          value="+$4,320"
          change="+2.8% vs last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Active Goals"
          value={String(sampleGoals.length)}
          change="1 near completion"
          changeType="neutral"
          icon={Target}
        />
        <StatCard
          title="Portfolio Items"
          value={String(sampleHoldings.length)}
          change="5 assets up today"
          changeType="positive"
          icon={PieChart}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Net Worth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-card rounded-xl border border-border p-5 lg:col-span-2"
        >
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Net Worth Over Time
          </h2>
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
              <Tooltip
                contentStyle={{
                  background: 'hsl(222, 44%, 8%)',
                  border: '1px solid hsl(222, 20%, 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 96%)',
                  fontSize: 12,
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(152, 60%, 48%)" fill="url(#netWorthGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Allocation Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-xl border border-border p-5"
        >
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Asset Allocation
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {allocationData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(222, 44%, 8%)',
                  border: '1px solid hsl(222, 20%, 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 96%)',
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}%`]}
              />
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

      {/* Goals Summary */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Financial Goals
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sampleGoals.map((goal, i) => (
            <GoalCard key={goal.id} goal={goal} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
