import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Trash2,
  PieChart as PieChartIcon,
  LayoutDashboard,
  History,
  ShoppingCart,
  Leaf,
  GlassWater,
  Home,
  Zap,
  User,
  Fuel,
  Car,
  Utensils,
  Sparkles,
  Stethoscope,
  GraduationCap,
  Smartphone,
  Heart,
  MoreHorizontal,
  Briefcase,
  Store,
  Laptop,
  Gift,
  ArrowLeft,
  ShieldCheck,
  Settings,
  Edit2,
  X,
  Check
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Transaction, TransactionType, Category } from './types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_MAP: Record<string, any> = {
  ShoppingCart, Leaf, GlassWater, Home, Zap, User, Fuel, Car, Utensils, 
  Sparkles, Stethoscope, GraduationCap, Smartphone, Heart, MoreHorizontal,
  Briefcase, Store, Laptop, Gift, ShieldCheck, History
};

const COLORS = [
  '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#fbbf24', '#ec4899', 
  '#ef4444', '#8b5cf6', '#f97316', '#d946ef', '#06b6d4', '#f43f5e', 
  '#64748b', '#059669', '#475569'
];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bharat_hisab_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenseCategories, setExpenseCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('bharat_hisab_expense_categories');
    return saved ? JSON.parse(saved) : EXPENSE_CATEGORIES;
  });

  const [incomeCategories, setIncomeCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('bharat_hisab_income_categories');
    return saved ? JSON.parse(saved) : INCOME_CATEGORIES;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add' | 'settings'>('dashboard');
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Category Management State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('MoreHorizontal');
  const [newCatColor, setNewCatColor] = useState(COLORS[0]);
  const [catManageType, setCatManageType] = useState<TransactionType>('expense');

  useEffect(() => {
    localStorage.setItem('bharat_hisab_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bharat_hisab_expense_categories', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem('bharat_hisab_income_categories', JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    const categories = formType === 'expense' ? expenseCategories : incomeCategories;
    const data = categories.map(cat => {
      const total = transactions
        .filter(t => t.type === formType && t.category === cat.id)
        .reduce((acc, t) => acc + t.amount, 0);
      return { name: cat.name, value: total, color: cat.color };
    }).filter(d => d.value > 0);
    return data;
  }, [transactions, formType, expenseCategories, incomeCategories]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      category,
      description,
      date,
      type: formType,
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setCategory('');
    setDescription('');
    setActiveTab('dashboard');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddOrUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const categories = catManageType === 'expense' ? expenseCategories : incomeCategories;
    const setCategories = catManageType === 'expense' ? setExpenseCategories : setIncomeCategories;

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: newCatName, icon: newCatIcon, color: newCatColor } 
          : c
      ));
    } else {
      const newCat: Category = {
        id: crypto.randomUUID(),
        name: newCatName,
        icon: newCatIcon,
        color: newCatColor
      };
      setCategories([...categories, newCat]);
    }

    setEditingCategory(null);
    setNewCatName('');
    setNewCatIcon('MoreHorizontal');
    setNewCatColor(COLORS[0]);
  };

  const deleteCategory = (id: string, type: TransactionType) => {
    const setCategories = type === 'expense' ? setExpenseCategories : setIncomeCategories;
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    setCategories(categories.filter(c => c.id !== id));
  };

  const renderIcon = (iconName: string, className?: string) => {
    const Icon = ICON_MAP[iconName] || MoreHorizontal;
    return <Icon className={className} />;
  };

  const currentCategories = formType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#1A1A1A] font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4 sticky top-0 z-20">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#D97706]">Bharat Hisab</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Daily Khata</p>
          </div>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "p-2 rounded-full transition-colors",
              activeTab === 'settings' ? "bg-[#FEF3C7] text-[#D97706]" : "bg-gray-50 text-gray-400"
            )}
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Balance Card */}
              <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706] opacity-10 rounded-full -mr-16 -mt-16" />
                <p className="text-gray-400 text-sm font-medium">Total Balance</p>
                <h2 className="text-4xl font-bold mt-1">₹{stats.balance.toLocaleString('en-IN')}</h2>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-green-400 mb-1">
                      <TrendingUp size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Income</span>
                    </div>
                    <p className="text-lg font-bold">₹{stats.income.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-red-400 mb-1">
                      <TrendingDown size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Expense</span>
                    </div>
                    <p className="text-lg font-bold">₹{stats.expense.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Expense Breakdown</h3>
                  <div className="flex bg-[#F3F4F6] p-1 rounded-xl text-xs font-bold">
                    <button 
                      onClick={() => setFormType('expense')}
                      className={cn("px-3 py-1.5 rounded-lg transition-all", formType === 'expense' ? "bg-white shadow-sm text-[#D97706]" : "text-gray-500")}
                    >
                      Expense
                    </button>
                    <button 
                      onClick={() => setFormType('income')}
                      className={cn("px-3 py-1.5 rounded-lg transition-all", formType === 'income' ? "bg-white shadow-sm text-green-600" : "text-gray-500")}
                    >
                      Income
                    </button>
                  </div>
                </div>
                
                <div className="h-64">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                      <PieChartIcon size={48} strokeWidth={1} />
                      <p className="text-sm">No data to show yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-bold text-lg">Recent Spends</h3>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="text-[#D97706] text-sm font-bold flex items-center gap-1"
                  >
                    See All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(t => {
                    const categories = t.type === 'expense' ? expenseCategories : incomeCategories;
                    const cat = categories.find(c => c.id === t.category);
                    return (
                      <div key={t.id} className="bg-white p-4 rounded-2xl border border-[#E5E5E5] flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-xl",
                          t.type === 'income' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                        )}>
                          {renderIcon(cat?.icon || 'MoreHorizontal', "w-5 h-5")}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{cat?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{t.description || 'No description'}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn("font-bold text-sm", t.type === 'income' ? "text-green-600" : "text-red-600")}>
                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">{format(parseISO(t.date), 'dd MMM')}</p>
                        </div>
                      </div>
                    );
                  })}
                  {transactions.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p>Start adding your daily expenses!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white rounded-full border border-[#E5E5E5]">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Transaction History</h2>
              </div>

              <div className="space-y-3">
                {transactions.map(t => {
                  const categories = t.type === 'expense' ? expenseCategories : incomeCategories;
                  const cat = categories.find(c => c.id === t.category);
                  return (
                    <div key={t.id} className="bg-white p-4 rounded-2xl border border-[#E5E5E5] flex items-center gap-4 group">
                      <div className={cn(
                        "p-3 rounded-xl",
                        t.type === 'income' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {renderIcon(cat?.icon || 'MoreHorizontal', "w-5 h-5")}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{cat?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{t.description || 'No description'}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{format(parseISO(t.date), 'PPPP')}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className={cn("font-bold text-sm", t.type === 'income' ? "text-green-600" : "text-red-600")}>
                          {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </p>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white rounded-full border border-[#E5E5E5]">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Add New Entry</h2>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-6">
                {/* Type Toggle */}
                <div className="flex bg-white p-1 rounded-2xl border border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => { setFormType('expense'); setCategory(''); }}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                      formType === 'expense' ? "bg-red-500 text-white shadow-lg" : "text-gray-500"
                    )}
                  >
                    <Minus size={18} /> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormType('income'); setCategory(''); }}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                      formType === 'income' ? "bg-green-500 text-white shadow-lg" : "text-gray-500"
                    )}
                  >
                    <Plus size={18} /> Income
                  </button>
                </div>

                {/* Amount Input */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-5xl font-bold focus:outline-none text-[#1A1A1A] placeholder:text-gray-100"
                    required
                  />
                </div>

                {/* Category Grid */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Select Category</label>
                  <div className="grid grid-cols-3 gap-3">
                    {currentCategories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all space-y-2",
                          category === cat.id 
                            ? "bg-white border-[#D97706] shadow-md ring-2 ring-[#D97706]/10" 
                            : "bg-white border-[#E5E5E5] text-gray-500 hover:border-gray-300"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-xl",
                          category === cat.id ? "bg-[#FEF3C7] text-[#D97706]" : "bg-gray-50"
                        )}>
                          {renderIcon(cat.icon, "w-6 h-6")}
                        </div>
                        <span className="text-[10px] font-bold text-center leading-tight">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Details */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What was this for?"
                      className="w-full py-2 border-b border-gray-100 focus:outline-none focus:border-[#D97706] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full py-2 pl-6 border-b border-gray-100 focus:outline-none focus:border-[#D97706] transition-colors bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={cn(
                    "w-full py-5 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95",
                    formType === 'expense' ? "bg-red-500 shadow-red-200" : "bg-green-500 shadow-green-200"
                  )}
                >
                  Save Transaction
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white rounded-full border border-[#E5E5E5]">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Manage Categories</h2>
              </div>

              {/* Category Form */}
              <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-sm space-y-6">
                <div className="flex bg-[#F3F4F6] p-1 rounded-xl text-xs font-bold">
                  <button 
                    onClick={() => setCatManageType('expense')}
                    className={cn("flex-1 py-2 rounded-lg transition-all", catManageType === 'expense' ? "bg-white shadow-sm text-red-600" : "text-gray-500")}
                  >
                    Expense
                  </button>
                  <button 
                    onClick={() => setCatManageType('income')}
                    className={cn("flex-1 py-2 rounded-lg transition-all", catManageType === 'income' ? "bg-white shadow-sm text-green-600" : "text-gray-500")}
                  >
                    Income
                  </button>
                </div>

                <form onSubmit={handleAddOrUpdateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category Name</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Gym, OTT, Rent"
                      className="w-full py-2 border-b border-gray-100 focus:outline-none focus:border-[#D97706] transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(ICON_MAP).map(iconName => (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setNewCatIcon(iconName)}
                          className={cn(
                            "p-2 rounded-lg border transition-all",
                            newCatIcon === iconName ? "bg-[#FEF3C7] border-[#D97706] text-[#D97706]" : "bg-gray-50 border-transparent text-gray-400"
                          )}
                        >
                          {renderIcon(iconName, "w-5 h-5")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Color</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCatColor(color)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            newCatColor === color ? "border-[#1A1A1A] scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1A1A1A] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      {editingCategory ? <Check size={18} /> : <Plus size={18} />}
                      {editingCategory ? 'Update' : 'Add Category'}
                    </button>
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(null);
                          setNewCatName('');
                        }}
                        className="p-3 bg-gray-100 text-gray-500 rounded-xl active:scale-95 transition-transform"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg px-2">Existing {catManageType === 'expense' ? 'Expense' : 'Income'} Categories</h3>
                {(catManageType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                  <div key={cat.id} className="bg-white p-4 rounded-2xl border border-[#E5E5E5] flex items-center gap-4 group">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      {renderIcon(cat.icon, "w-5 h-5")}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{cat.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setNewCatName(cat.name);
                          setNewCatIcon(cat.icon);
                          setNewCatColor(cat.color);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteCategory(cat.id, catManageType)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] px-6 py-4 z-30">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === 'dashboard' ? "text-[#D97706]" : "text-gray-400")}
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('add')}
            className="bg-[#D97706] text-white p-4 rounded-full shadow-lg shadow-orange-200 -mt-12 border-4 border-[#FDFCF0] active:scale-90 transition-transform"
          >
            <Plus size={28} />
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === 'history' ? "text-[#D97706]" : "text-gray-400")}
          >
            <History size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
