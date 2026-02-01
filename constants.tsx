import React from 'react';
import { LayoutDashboard, ReceiptText, FileBarChart, CalendarDays, Wallet, Settings, PlusCircle, Search, Bell, HelpCircle } from 'lucide-react';
import { Currency } from './types';

export const INCOME_CATEGORIES = [
  'General Tithes',
  'Sunday Offerings',
  'Donations',
  'Church Projects',
  'Pledges',
  'Fundraising'
];

export const EXPENSE_CATEGORIES = [
  'Outreach missions',
  'Youth Ministry',
  'Maintenance',
  'Utilities',
  'Charity Work',
  'Special Events',
  'Others'
];

// Combine for global filters and backward compatibility
export const CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export const PAYMENT_METHODS = [
  'Cash',
  'Bank Transfer',
  'Mobile Money',
  'Check',
  'Online Payment'
];

export const CURRENCY_OPTIONS = [
  { code: Currency.USD, symbol: '$', label: 'US Dollar' },
  { code: Currency.ZAR, symbol: 'R', label: 'SA Rand' },
  { code: Currency.BWP, symbol: 'P', label: 'Botswana Pula' },
  { code: Currency.ZIG, symbol: 'ZiG', label: 'Zimbabwe Gold' }
];

export const getCurrencySymbol = (code: Currency) => {
  return CURRENCY_OPTIONS.find(c => c.code === code)?.symbol || '$';
};

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { label: 'Transactions', icon: <ReceiptText size={20} />, id: 'transactions' },
  { label: 'Reports', icon: <FileBarChart size={20} />, id: 'reports' },
  { label: 'Events', icon: <CalendarDays size={20} />, id: 'events' },
  { label: 'Assets', icon: <Wallet size={20} />, id: 'assets' },
  { label: 'Settings', icon: <Settings size={20} />, id: 'settings' }
];
