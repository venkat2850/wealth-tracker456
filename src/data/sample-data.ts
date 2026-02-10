export interface Goal {
  id: string;
  name: string;
  type: 'retirement' | 'home' | 'education' | 'custom';
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  createdAt: string;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'bond' | 'mutual_fund' | 'cash';
  units: number;
  avgBuyPrice: number;
  currentPrice: number;
  change24h: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'dividend' | 'contribution' | 'withdrawal';
  units: number;
  price: number;
  date: string;
}

export const sampleGoals: Goal[] = [
  {
    id: '1',
    name: 'Retirement Fund',
    type: 'retirement',
    targetAmount: 1500000,
    currentAmount: 342000,
    monthlyContribution: 2500,
    targetDate: '2050-01-01',
    createdAt: '2020-06-15',
  },
  {
    id: '2',
    name: 'Dream Home',
    type: 'home',
    targetAmount: 400000,
    currentAmount: 87000,
    monthlyContribution: 1500,
    targetDate: '2028-06-01',
    createdAt: '2022-01-10',
  },
  {
    id: '3',
    name: "Children's Education",
    type: 'education',
    targetAmount: 200000,
    currentAmount: 45000,
    monthlyContribution: 800,
    targetDate: '2035-09-01',
    createdAt: '2021-09-01',
  },
  {
    id: '4',
    name: 'Emergency Fund',
    type: 'custom',
    targetAmount: 50000,
    currentAmount: 38000,
    monthlyContribution: 500,
    targetDate: '2025-12-01',
    createdAt: '2023-03-20',
  },
];

export const sampleHoldings: Holding[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', units: 50, avgBuyPrice: 145.20, currentPrice: 178.72, change24h: 1.24 },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', units: 30, avgBuyPrice: 280.50, currentPrice: 378.91, change24h: -0.38 },
  { id: '3', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'etf', units: 100, avgBuyPrice: 380.00, currentPrice: 462.35, change24h: 0.67 },
  { id: '4', symbol: 'BND', name: 'Vanguard Total Bond ETF', type: 'bond', units: 200, avgBuyPrice: 72.50, currentPrice: 71.20, change24h: -0.12 },
  { id: '5', symbol: 'VTI', name: 'Vanguard Total Stock Market', type: 'etf', units: 80, avgBuyPrice: 210.30, currentPrice: 245.80, change24h: 0.89 },
  { id: '6', symbol: 'VXUS', name: 'Vanguard Intl Stock ETF', type: 'etf', units: 120, avgBuyPrice: 55.40, currentPrice: 58.15, change24h: 0.45 },
  { id: '7', symbol: 'CASH', name: 'Cash Reserves', type: 'cash', units: 1, avgBuyPrice: 15000, currentPrice: 15000, change24h: 0 },
];

export const sampleTransactions: Transaction[] = [
  { id: '1', symbol: 'AAPL', type: 'buy', units: 20, price: 142.50, date: '2024-01-15' },
  { id: '2', symbol: 'VOO', type: 'buy', units: 25, price: 420.00, date: '2024-02-01' },
  { id: '3', symbol: 'MSFT', type: 'dividend', units: 0, price: 45.00, date: '2024-02-15' },
  { id: '4', symbol: 'BND', type: 'buy', units: 50, price: 71.80, date: '2024-03-01' },
  { id: '5', symbol: 'AAPL', type: 'sell', units: 10, price: 175.30, date: '2024-03-10' },
  { id: '6', symbol: 'VTI', type: 'buy', units: 30, price: 235.60, date: '2024-04-01' },
  { id: '7', symbol: 'VXUS', type: 'contribution', units: 40, price: 56.20, date: '2024-04-15' },
];

export const netWorthHistory = [
  { month: 'Jul', value: 380000 },
  { month: 'Aug', value: 392000 },
  { month: 'Sep', value: 385000 },
  { month: 'Oct', value: 410000 },
  { month: 'Nov', value: 425000 },
  { month: 'Dec', value: 438000 },
  { month: 'Jan', value: 445000 },
  { month: 'Feb', value: 460000 },
  { month: 'Mar', value: 452000 },
  { month: 'Apr', value: 478000 },
  { month: 'May', value: 495000 },
  { month: 'Jun', value: 512000 },
];

export const allocationData = [
  { name: 'US Stocks', value: 42, color: 'hsl(152, 60%, 48%)' },
  { name: 'Intl Stocks', value: 15, color: 'hsl(210, 100%, 56%)' },
  { name: 'Bonds', value: 18, color: 'hsl(38, 92%, 50%)' },
  { name: 'ETFs', value: 18, color: 'hsl(280, 65%, 60%)' },
  { name: 'Cash', value: 7, color: 'hsl(215, 20%, 55%)' },
];

export const riskProfiles = {
  conservative: {
    label: 'Conservative',
    description: 'Low risk, stable returns. Focus on bonds and fixed income.',
    allocation: { stocks: 20, bonds: 50, etfs: 15, cash: 15 },
  },
  moderate: {
    label: 'Moderate',
    description: 'Balanced risk-reward. Mix of stocks and bonds.',
    allocation: { stocks: 45, bonds: 30, etfs: 15, cash: 10 },
  },
  aggressive: {
    label: 'Aggressive',
    description: 'High risk, high potential returns. Heavy equity exposure.',
    allocation: { stocks: 70, bonds: 10, etfs: 15, cash: 5 },
  },
};
