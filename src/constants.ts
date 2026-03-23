import { Category } from './types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'kirana', name: 'Kirana (Groceries)', icon: 'ShoppingCart', color: '#f59e0b' },
  { id: 'sabzi', name: 'Sabzi (Vegetables)', icon: 'Leaf', color: '#10b981' },
  { id: 'milk', name: 'Milk/Doodh', icon: 'GlassWater', color: '#3b82f6' },
  { id: 'rent', name: 'Rent/Kiraya', icon: 'Home', color: '#6366f1' },
  { id: 'bijli', name: 'Electricity/Bijli', icon: 'Zap', color: '#fbbf24' },
  { id: 'maid', name: 'Maid/Kamwali', icon: 'User', color: '#ec4899' },
  { id: 'petrol', name: 'Petrol/Diesel', icon: 'Fuel', color: '#ef4444' },
  { id: 'transport', name: 'Transport (Auto/Rickshaw)', icon: 'Car', color: '#8b5cf6' },
  { id: 'eating_out', name: 'Eating Out (Chaat/Dhaba)', icon: 'Utensils', color: '#f97316' },
  { id: 'festivals', name: 'Festivals/Pooja', icon: 'Sparkles', color: '#d946ef' },
  { id: 'medical', name: 'Medical/Dawai', icon: 'Stethoscope', color: '#ef4444' },
  { id: 'education', name: 'Education/Fees', icon: 'GraduationCap', color: '#06b6d4' },
  { id: 'recharge', name: 'Mobile/Recharge', icon: 'Smartphone', color: '#3b82f6' },
  { id: 'emi', name: 'EMI/Loan', icon: 'History', color: '#475569' },
  { id: 'insurance', name: 'Insurance', icon: 'ShieldCheck', color: '#059669' },
  { id: 'mandir', name: 'Mandir/Donation', icon: 'Heart', color: '#f43f5e' },
  { id: 'others', name: 'Others', icon: 'MoreHorizontal', color: '#64748b' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: '#10b981' },
  { id: 'business', name: 'Business', icon: 'Store', color: '#3b82f6' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '#8b5cf6' },
  { id: 'shagun', name: 'Gift/Shagun', icon: 'Gift', color: '#f43f5e' },
  { id: 'others', name: 'Others', icon: 'MoreHorizontal', color: '#64748b' },
];
