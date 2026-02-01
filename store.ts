
import { useState, useEffect } from 'react';
import { Transaction, ChurchEvent, TransactionType, TransactionStatus, Currency, Asset, AssetType, UserProfile, ChurchProfile } from './types';

const STORAGE_KEY_TRANSACTIONS = 'ccas_transactions';
const STORAGE_KEY_EVENTS = 'ccas_events';
const STORAGE_KEY_SETTINGS = 'ccas_settings';
const STORAGE_KEY_ASSETS = 'ccas_assets';
const STORAGE_KEY_USER_PROFILE = 'ccas_user_profile';
const STORAGE_KEY_CHURCH_PROFILE = 'ccas_church_profile';

const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: '1',
    name: 'Main Church Building Fund',
    description: 'Ongoing project for the sanctuary expansion.',
    targetAmount: 5000000,
    currentAmount: 0,
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800'
  }
];

const INITIAL_ASSETS: Asset[] = [
  { id: 'as-1', name: 'Church Sanctuary Land', type: AssetType.FIXED, value: 250000, currency: Currency.USD, condition: 'Excellent', lastValuation: '2023-01-15' },
  { id: 'as-2', name: 'Sound System & Media Gear', type: AssetType.FIXED, value: 15000, currency: Currency.USD, condition: 'Good', lastValuation: '2023-06-10' },
  { id: 'as-3', name: 'Church Bus (Toyota Coaster)', type: AssetType.FIXED, value: 45000, currency: Currency.USD, condition: 'Good', lastValuation: '2023-03-22' },
  { id: 'as-4', name: 'Operational Savings Account', type: AssetType.LIQUID, value: 12500, currency: Currency.USD, condition: 'Excellent', lastValuation: '2023-10-01' }
];

const DEFAULT_USER: UserProfile = {
  name: 'Samuel Adams',
  role: 'Finance Officer',
  contact: '+263 777 000 000'
};

const DEFAULT_CHURCH: ChurchProfile = {
  name: 'Grace Cathedral',
  branch: 'Main Branch',
  district: 'Central District',
  province: 'Harare',
  address: '123 Faith Street',
  contact: '+263 242 000 000',
  email: 'admin@gracecathedral.org',
  website: 'www.gracecathedral.org',
  logo: ''
};

export const useStore = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);
  const [churchProfile, setChurchProfile] = useState<ChurchProfile>(DEFAULT_CHURCH);
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>(Currency.USD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTx = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    const storedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
    const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const storedAssets = localStorage.getItem(STORAGE_KEY_ASSETS);
    const storedUser = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
    const storedChurch = localStorage.getItem(STORAGE_KEY_CHURCH_PROFILE);

    if (storedTx) setTransactions(JSON.parse(storedTx));
    if (storedEvents) setEvents(JSON.parse(storedEvents));
    if (storedAssets) setAssets(JSON.parse(storedAssets));
    if (storedUser) setUserProfile(JSON.parse(storedUser));
    if (storedChurch) setChurchProfile(JSON.parse(storedChurch));

    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      if (settings.defaultCurrency) setDefaultCurrency(settings.defaultCurrency);
    }

    setLoading(false);
  }, []);

  const updateDefaultCurrency = (currency: Currency) => {
    setDefaultCurrency(currency);
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || '{}');
    settings.defaultCurrency = currency;
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(profile));
  };

  const updateChurchProfile = (profile: ChurchProfile) => {
    setChurchProfile(profile);
    localStorage.setItem(STORAGE_KEY_CHURCH_PROFILE, JSON.stringify(profile));
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: `tx-${Date.now()}` } as Transaction;
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));

    if (tx.eventId && tx.type === TransactionType.INCOME) {
        updateEventProgress(tx.eventId, tx.amount);
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...updates } : t);
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (txToDelete?.eventId && txToDelete.type === TransactionType.INCOME) {
        updateEventProgress(txToDelete.eventId, -txToDelete.amount);
    }
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
  };

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset = { ...asset, id: `as-${Date.now()}` } as Asset;
    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(updated));
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    const updated = assets.map(a => a.id === id ? { ...a, ...updates } : a);
    setAssets(updated);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(updated));
  };

  const addEvent = (event: Omit<ChurchEvent, 'id' | 'currentAmount'>) => {
    const newEvent = { 
      ...event, 
      id: `ev-${Date.now()}`, 
      currentAmount: 0 
    } as ChurchEvent;
    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updated));
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updated));
    const updatedTx = transactions.map(tx => tx.eventId === id ? { ...tx, eventId: undefined } : tx);
    setTransactions(updatedTx);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updatedTx));
  };

  const deleteAsset = (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(updated));
  };

  const updateEventProgress = (eventId: string, amount: number) => {
    const updatedEvents = events.map(ev => 
        ev.id === eventId ? { ...ev, currentAmount: ev.currentAmount + amount } : ev
    );
    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updatedEvents));
  };

  const clearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const backupData = () => {
    const data = {
        transactions,
        events,
        assets,
        userProfile,
        churchProfile,
        settings: { defaultCurrency },
        timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CCAS_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return { 
    transactions, 
    events, 
    assets,
    userProfile,
    churchProfile,
    updateUserProfile,
    updateChurchProfile,
    defaultCurrency, 
    updateDefaultCurrency, 
    addTransaction, 
    updateTransaction,
    deleteTransaction,
    addAsset,
    updateAsset,
    addEvent,
    deleteEvent,
    deleteAsset,
    loading, 
    clearData, 
    backupData 
  };
};
