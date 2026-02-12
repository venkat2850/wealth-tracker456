import { useHoldings } from "@/hooks/useHoldings";
import { useTransactions } from "@/hooks/useTransactions";
import { sampleHoldings, sampleTransactions } from "@/data/sample-data";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Portfolio() {
  const { holdings: dbHoldings, isLoading: loadingH } = useHoldings();
  const { transactions: dbTransactions, isLoading: loadingT } = useTransactions();

  // Use DB data if available, fall back to sample data
  const holdings = dbHoldings.length > 0 ? dbHoldings.map(h => ({
    ...h,
    avgBuyPrice: Number(h.avg_buy_price),
    currentPrice: Number(h.current_price),
    change24h: Number(h.change_24h),
    units: Number(h.units),
  })) : sampleHoldings;

  const transactions = dbTransactions.length > 0 ? dbTransactions.map(t => ({
    id: t.id,
    symbol: t.symbol,
    type: t.type as any,
    units: Number(t.units ?? 0),
    price: Number(t.price),
    date: t.date,
  })) : sampleTransactions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Portfolio</h1>
        <p className="text-sm text-muted-foreground">Your investment holdings and transactions</p>
      </div>

      <Tabs defaultValue="holdings">
        <TabsList className="bg-secondary">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gradient-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Asset</th>
                    <th className="px-4 py-3 text-right font-medium">Units</th>
                    <th className="px-4 py-3 text-right font-medium">Avg Cost</th>
                    <th className="px-4 py-3 text-right font-medium">Price</th>
                    <th className="px-4 py-3 text-right font-medium">Value</th>
                    <th className="px-4 py-3 text-right font-medium">P&L</th>
                    <th className="px-4 py-3 text-right font-medium">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => {
                    const value = h.units * h.currentPrice;
                    const cost = h.units * h.avgBuyPrice;
                    const pnl = value - cost;
                    const pnlPct = cost > 0 ? ((pnl / cost) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={h.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3"><div><span className="font-mono font-semibold text-foreground">{h.symbol}</span><p className="text-xs text-muted-foreground">{h.name}</p></div></td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">{h.units}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">${h.avgBuyPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">${h.currentPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-medium text-foreground">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className={`px-4 py-3 text-right font-mono font-medium ${pnl >= 0 ? "text-success" : "text-destructive"}`}>
                          {pnl >= 0 ? "+" : ""}${pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({pnlPct}%)
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex items-center gap-0.5 text-xs font-mono ${h.change24h > 0 ? "text-success" : h.change24h < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {h.change24h > 0 ? <ArrowUpRight className="h-3 w-3" /> : h.change24h < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                            {Math.abs(h.change24h)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gradient-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Symbol</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-right font-medium">Units</th>
                    <th className="px-4 py-3 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{t.date}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-foreground">{t.symbol}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          t.type === 'buy' ? 'bg-success/15 text-success' :
                          t.type === 'sell' ? 'bg-destructive/15 text-destructive' :
                          t.type === 'dividend' ? 'bg-warning/15 text-warning' :
                          'bg-info/15 text-info'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">{t.units || '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">${t.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
