
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Events from './pages/Events';
import Reporting from './pages/Reporting';
import Settings from './pages/Settings';
import Assets from './pages/Assets';
import TransactionForm from './components/TransactionForm';
import AssetForm from './components/AssetForm';
import EventForm from './components/EventForm';
import { useStore } from './store';
import { Asset } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(undefined);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [preselectedEventId, setPreselectedEventId] = useState<string | undefined>(undefined);
  
  const { 
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
    clearData, 
    backupData 
  } = useStore();

  const handleOpenTransactionForm = (eventId?: string) => {
    setPreselectedEventId(eventId);
    setIsFormOpen(true);
  };

  const handleCloseTransactionForm = () => {
    setIsFormOpen(false);
    setPreselectedEventId(undefined);
  };

  const handleOpenAssetForm = (asset?: Asset) => {
    setEditingAsset(asset);
    setIsAssetFormOpen(true);
  };

  const handleSaveAsset = (data: any) => {
    if (editingAsset) {
      updateAsset(editingAsset.id, data);
    } else {
      addAsset(data);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} defaultCurrency={defaultCurrency} />;
      case 'transactions':
        return <Transactions transactions={transactions} onUpdate={updateTransaction} />;
      case 'events':
        return (
          <Events 
            events={events} 
            defaultCurrency={defaultCurrency} 
            onInitCampaign={() => setIsEventFormOpen(true)}
            onRecordEntry={handleOpenTransactionForm}
            onDeleteEvent={deleteEvent}
          />
        );
      case 'reports':
        return <Reporting transactions={transactions} />;
      case 'assets':
        return (
          <Assets 
            assets={assets} 
            defaultCurrency={defaultCurrency} 
            onRegisterAsset={() => handleOpenAssetForm()} 
            onEditAsset={handleOpenAssetForm}
            onDeleteAsset={deleteAsset}
          />
        );
      case 'settings':
        return (
          <Settings 
            onClear={clearData} 
            onBackup={backupData} 
            defaultCurrency={defaultCurrency} 
            onCurrencyChange={updateDefaultCurrency} 
            userProfile={userProfile}
            churchProfile={churchProfile}
            onUpdateUserProfile={updateUserProfile}
            onUpdateChurchProfile={updateChurchProfile}
          />
        );
      default:
        return <Dashboard transactions={transactions} defaultCurrency={defaultCurrency} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onAddTransaction={() => handleOpenTransactionForm()}
      userProfile={userProfile}
    >
      {renderContent()}
      
      {isFormOpen && (
        <TransactionForm 
          events={events}
          defaultCurrency={defaultCurrency}
          initialEventId={preselectedEventId}
          onClose={handleCloseTransactionForm} 
          onSave={addTransaction}
        />
      )}

      {isAssetFormOpen && (
        <AssetForm 
          defaultCurrency={defaultCurrency}
          asset={editingAsset}
          onClose={() => {
            setIsAssetFormOpen(false);
            setEditingAsset(undefined);
          }} 
          onSave={handleSaveAsset}
        />
      )}

      {isEventFormOpen && (
        <EventForm 
          onClose={() => setIsEventFormOpen(false)}
          onSave={addEvent}
        />
      )}
    </Layout>
  );
};

export default App;
