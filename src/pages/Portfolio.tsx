import { useState } from "react";
import { useHoldings } from "@/hooks/useHoldings";
import { useTransactions } from "@/hooks/useTransactions";
import { sampleHoldings, sampleTransactions } from "@/data/sample-data";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus, Plus, Trash2, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Portfolio() {
  const { holdings: dbHoldings, isLoading: loadingH, createHolding, updateHolding, deleteHolding } = useHoldings();
  const { transactions: dbTransactions, isLoading: loadingT, createTransaction, deleteTransaction } = useTransactions();

  const [holdingOpen, setHoldingOpen] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [editHolding, setEditHolding] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [hForm, setHForm] = useState({ symbol: "", name: "", type: "stock", units: "", avgBuyPrice: "", currentPrice: "" });
  const [tForm, setTForm] = useState({ symbol: "", type: "buy", units: "", price: "", date: "" });

  const holdings = dbHoldings.length > 0 ? dbHoldings.map(h => ({
    ...h, avgBuyPrice: Number(h.avg_buy_price), currentPrice: Number(h.current_price), change24h: Number(h.change_24h), units: Number(h.units),
  })) : sampleHoldings;

  const transactions = dbTransactions.length > 0 ? dbTransactions.map(t => ({
    id: t.id, symbol: t.symbol, type: t.type as any, units: Number(t.units ?? 0), price: Number(t.price), date: t.date,
  })) : sampleTransactions;

  const handleCreateHolding = () => {
    if (!hForm.symbol || !hForm.name || !hForm.units) return;
    createHolding.mutate({
      symbol: hForm.symbol.toUpperCase(), name: hForm.name, type: hForm.type,
      units: Number(hForm.units), avg_buy_price: Number(hForm.avgBuyPrice) || 0, current_price: Number(hForm.currentPrice) || 0,
    }, {
      onSuccess: () => { setHForm({ symbol: "", name: "", type: "stock", units: "", avgBuyPrice: "", currentPrice: "" }); setHoldingOpen(false); },
    });
  };

  const handleUpdateHolding = () => {
    if (!editHolding) return;
    updateHolding.mutate({
      id: editHolding.id, symbol: editHolding.symbol, name: editHolding.name, type: editHolding.type,
      units: Number(editHolding.units), avg_buy_price: Number(editHolding.avg_buy_price), current_price: Number(editHolding.current_price),
    }, {
      onSuccess: () => { setEditOpen(false); setEditHolding(null); },
    });
  };

  const handleCreateTx = () => {
    if (!tForm.symbol || !tForm.price || !tForm.date) return;
    createTransaction.mutate({
      symbol: tForm.symbol.toUpperCase(), type: tForm.type,
      units: tForm.units ? Number(tForm.units) : null, price: Number(tForm.price), date: tForm.date,
    }, {
      onSuccess: () => { setTForm({ symbol: "", type: "buy", units: "", price: "", date: "" }); setTxOpen(false); },
    });
  };

  const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5"><Label className="text-muted-foreground">{label}</Label>{children}</div>
  );

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

        <TabsContent value="holdings" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Dialog open={holdingOpen} onOpenChange={setHoldingOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Holding</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle className="text-foreground">Add New Holding</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Symbol"><Input value={hForm.symbol} onChange={e => setHForm({ ...hForm, symbol: e.target.value })} placeholder="AAPL" className="bg-secondary border-border" /></FormField>
                    <FormField label="Name"><Input value={hForm.name} onChange={e => setHForm({ ...hForm, name: e.target.value })} placeholder="Apple Inc." className="bg-secondary border-border" /></FormField>
                  </div>
                  <FormField label="Type">
                    <Select value={hForm.type} onValueChange={v => setHForm({ ...hForm, type: v })}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stock">Stock</SelectItem>
                        <SelectItem value="etf">ETF</SelectItem>
                        <SelectItem value="bond">Bond</SelectItem>
                        <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Units"><Input type="number" value={hForm.units} onChange={e => setHForm({ ...hForm, units: e.target.value })} placeholder="100" className="bg-secondary border-border" /></FormField>
                    <FormField label="Avg Buy Price"><Input type="number" value={hForm.avgBuyPrice} onChange={e => setHForm({ ...hForm, avgBuyPrice: e.target.value })} placeholder="150.00" className="bg-secondary border-border" /></FormField>
                    <FormField label="Current Price"><Input type="number" value={hForm.currentPrice} onChange={e => setHForm({ ...hForm, currentPrice: e.target.value })} placeholder="175.00" className="bg-secondary border-border" /></FormField>
                  </div>
                  <Button onClick={handleCreateHolding} className="w-full" disabled={createHolding.isPending}>
                    {createHolding.isPending ? "Adding..." : "Add Holding"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Holding Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="text-foreground">Edit Holding</DialogTitle></DialogHeader>
              {editHolding && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Symbol"><Input value={editHolding.symbol} onChange={e => setEditHolding({ ...editHolding, symbol: e.target.value })} className="bg-secondary border-border" /></FormField>
                    <FormField label="Name"><Input value={editHolding.name} onChange={e => setEditHolding({ ...editHolding, name: e.target.value })} className="bg-secondary border-border" /></FormField>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Units"><Input type="number" value={editHolding.units} onChange={e => setEditHolding({ ...editHolding, units: e.target.value })} className="bg-secondary border-border" /></FormField>
                    <FormField label="Avg Buy Price"><Input type="number" value={editHolding.avg_buy_price} onChange={e => setEditHolding({ ...editHolding, avg_buy_price: e.target.value })} className="bg-secondary border-border" /></FormField>
                    <FormField label="Current Price"><Input type="number" value={editHolding.current_price} onChange={e => setEditHolding({ ...editHolding, current_price: e.target.value })} className="bg-secondary border-border" /></FormField>
                  </div>
                  <Button onClick={handleUpdateHolding} className="w-full" disabled={updateHolding.isPending}>
                    {updateHolding.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

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
                    {dbHoldings.length > 0 && <th className="px-4 py-3 text-right font-medium">Actions</th>}
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
                        {dbHoldings.length > 0 && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditHolding(h); setEditOpen(true); }}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card border-border">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-foreground">Delete {h.symbol}?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently remove this holding from your portfolio.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteHolding.mutate(h.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Dialog open={txOpen} onOpenChange={setTxOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Transaction</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle className="text-foreground">Record Transaction</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Symbol"><Input value={tForm.symbol} onChange={e => setTForm({ ...tForm, symbol: e.target.value })} placeholder="AAPL" className="bg-secondary border-border" /></FormField>
                    <FormField label="Type">
                      <Select value={tForm.type} onValueChange={v => setTForm({ ...tForm, type: v })}>
                        <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                          <SelectItem value="dividend">Dividend</SelectItem>
                          <SelectItem value="contribution">Contribution</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Units"><Input type="number" value={tForm.units} onChange={e => setTForm({ ...tForm, units: e.target.value })} placeholder="50" className="bg-secondary border-border" /></FormField>
                    <FormField label="Price"><Input type="number" value={tForm.price} onChange={e => setTForm({ ...tForm, price: e.target.value })} placeholder="175.00" className="bg-secondary border-border" /></FormField>
                    <FormField label="Date"><Input type="date" value={tForm.date} onChange={e => setTForm({ ...tForm, date: e.target.value })} className="bg-secondary border-border" /></FormField>
                  </div>
                  <Button onClick={handleCreateTx} className="w-full" disabled={createTransaction.isPending}>
                    {createTransaction.isPending ? "Recording..." : "Record Transaction"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

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
                    {dbTransactions.length > 0 && <th className="px-4 py-3 text-right font-medium">Actions</th>}
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
                      {dbTransactions.length > 0 && (
                        <td className="px-4 py-3 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Delete transaction?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently remove this {t.type} transaction for {t.symbol}.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTransaction.mutate(t.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      )}
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
