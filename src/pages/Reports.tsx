import { sampleHoldings, netWorthHistory, allocationData } from "@/data/sample-data";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const totalValue = sampleHoldings.reduce((s, h) => s + h.units * h.currentPrice, 0);
const totalCost = sampleHoldings.reduce((s, h) => s + h.units * h.avgBuyPrice, 0);

const monthlyReturns = netWorthHistory.map((item, i) => ({
  month: item.month,
  return: i === 0 ? 0 : ((item.value - netWorthHistory[i - 1].value) / netWorthHistory[i - 1].value * 100),
}));

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Performance analytics and insights</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Portfolio Value', value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Total Cost Basis', value: `$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Unrealized P&L', value: `$${(totalValue - totalCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-card rounded-xl border border-border p-5 text-center"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-xl font-bold font-mono text-foreground">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Returns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card rounded-xl border border-border p-5"
        >
          <h2 className="mb-4 text-sm font-semibold text-foreground">Monthly Returns (%)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`} />
              <Tooltip
                contentStyle={{ background: 'hsl(222, 44%, 8%)', border: '1px solid hsl(222, 20%, 16%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)', fontSize: 12 }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
              />
              <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                {monthlyReturns.map((entry, i) => (
                  <Cell key={i} fill={entry.return >= 0 ? 'hsl(152, 60%, 48%)' : 'hsl(0, 72%, 56%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Allocation Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gradient-card rounded-xl border border-border p-5"
        >
          <h2 className="mb-4 text-sm font-semibold text-foreground">Allocation Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {allocationData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'hsl(222, 44%, 8%)', border: '1px solid hsl(222, 20%, 16%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
