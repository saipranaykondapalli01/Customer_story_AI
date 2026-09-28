import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CustomerSearch } from './components/CustomerSearch';
import { CustomerStoryCard } from './components/CustomerStoryCard';
import { CustomerInsights } from './components/CustomerInsights';
import { InteractionHistory } from './components/InteractionHistory';
import { AddInteractionForm } from './components/AddInteractionForm';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentCustomer, setCurrentCustomer] = useState<string>('Rahul');
  const [summary, setSummary] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Check backend health
  const checkBackendHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    const isUp = await api.checkHealth();
    setIsBackendConnected(isUp);
    setIsCheckingHealth(false);
    return isUp;
  }, []);

  // Sequential fetching to prevent Hindsight backend concurrency locks / 500 errors
  const fetchCustomerData = useCallback(async (customerName: string) => {
    if (!customerName.trim()) return;

    setApiError(null);
    setIsHistoryLoading(true);
    setIsSummaryLoading(true);

    let historySuccess = false;
    let summarySuccess = false;

    // 1. Fetch History FIRST
    try {
      const historyData = await api.getHistory(customerName);
      setHistory(historyData.history || []);
      historySuccess = true;
    } catch (err: any) {
      console.error('Failed to fetch customer history:', err);
      setHistory([]);
    } finally {
      setIsHistoryLoading(false);
    }

    // 2. Fetch Summary SECOND (prevents concurrent Hindsight DB lock)
    try {
      const summaryData = await api.getSummary(customerName);
      setSummary(summaryData.summary || '');
      summarySuccess = true;
    } catch (err: any) {
      console.error('Failed to fetch customer summary:', err);
      setSummary('');
    } finally {
      setIsSummaryLoading(false);
    }

    if (!historySuccess && !summarySuccess) {
      const isUp = await api.checkHealth();
      setIsBackendConnected(isUp);
      if (!isUp) {
        setApiError('Unable to connect to FastAPI backend at http://127.0.0.1:8000.');
      }
    } else {
      setIsBackendConnected(true);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    checkBackendHealth();
    if (currentCustomer) {
      fetchCustomerData(currentCustomer);
    }
  }, []);

  const handleSearch = (name: string) => {
    setCurrentCustomer(name);
    fetchCustomerData(name);
  };

  const handleRefreshSummary = async () => {
    if (currentCustomer) {
      setIsSummaryLoading(true);
      try {
        const res = await api.getSummary(currentCustomer);
        setSummary(res.summary);
      } catch (err) {
        console.error('Failed to refresh summary:', err);
      } finally {
        setIsSummaryLoading(false);
      }
    }
  };

  const handleInteractionSuccess = (savedCustomerName: string) => {
    setCurrentCustomer(savedCustomerName);
    fetchCustomerData(savedCustomerName);
  };

  return (
    <div className="app-container">
      {/* 1. Header */}
      <Header
        isBackendConnected={isBackendConnected}
        isCheckingHealth={isCheckingHealth}
        onRetryConnection={() => {
          checkBackendHealth();
          if (currentCustomer) fetchCustomerData(currentCustomer);
        }}
      />

      {/* Backend Disconnected Warning */}
      {!isBackendConnected && (
        <ErrorState
          message={apiError || 'FastAPI Backend service is unavailable.'}
          onRetry={() => {
            checkBackendHealth();
            if (currentCustomer) fetchCustomerData(currentCustomer);
          }}
        />
      )}

      {/* 2. Customer Search & Quick Preset Bar */}
      <CustomerSearch
        currentCustomer={currentCustomer}
        onSearch={handleSearch}
        isLoading={isSummaryLoading || isHistoryLoading}
      />

      {/* Main Dashboard Layout */}
      {!currentCustomer ? (
        <EmptyState onSelectSample={handleSearch} />
      ) : (
        <div className="dashboard-grid">
          {/* Main Column (Story + Insights + History) */}
          <div className="grid-main">
            {/* 3. Customer Story (MAIN Visual Focus) */}
            <CustomerStoryCard
              customerName={currentCustomer}
              summary={summary}
              isLoading={isSummaryLoading}
              onRefresh={handleRefreshSummary}
            />

            {/* 4. Customer Insights */}
            <CustomerInsights
              summary={summary}
              history={history}
              customerName={currentCustomer}
              isLoading={isSummaryLoading || isHistoryLoading}
            />

            {/* 5. Interaction History Timeline */}
            <InteractionHistory
              customerName={currentCustomer}
              history={history}
              isLoading={isHistoryLoading}
            />
          </div>

          {/* Sidebar Column (Add New Interaction Form) */}
          <div className="grid-sidebar">
            {/* 6. Add New Interaction Form */}
            <AddInteractionForm
              currentCustomer={currentCustomer}
              onSuccess={handleInteractionSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
