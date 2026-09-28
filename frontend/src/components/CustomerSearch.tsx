import React, { useState } from 'react';
import { Search, UserCheck, Sparkles } from 'lucide-react';

interface CustomerSearchProps {
  currentCustomer: string;
  onSearch: (customerName: string) => void;
  isLoading: boolean;
}

const SAMPLE_CUSTOMERS = [
  { name: 'Rahul', label: 'Rahul (Featured Demo)', isHighlight: true },
  { name: 'Anita Sharma', label: 'Anita', isHighlight: false },
  { name: 'Vikram Patel', label: 'Vikram', isHighlight: false },
  { name: 'Sarah Jenkins', label: 'Sarah', isHighlight: false },
];

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  currentCustomer,
  onSearch,
  isLoading,
}) => {
  const [inputVal, setInputVal] = useState(currentCustomer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleChipClick = (name: string) => {
    setInputVal(name);
    onSearch(name);
  };

  return (
    <div className="search-section">
      <div className="search-label-row">
        <label htmlFor="customer-search-input">
          <UserCheck size={18} style={{ color: 'var(--accent-indigo)' }} />
          Lookup Customer Memory Bank
        </label>
        {currentCustomer && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Active Profile: <strong style={{ color: '#fff' }}>{currentCustomer}</strong>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="search-form-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-input-icon" />
          <input
            id="customer-search-input"
            type="text"
            className="search-input"
            placeholder="Enter customer name (e.g. Rahul, Anita, Vikram)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || !inputVal.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner" /> Searching...
            </>
          ) : (
            <>
              <Search size={16} /> Load Story
            </>
          )}
        </button>
      </form>

      <div className="sample-chips">
        <span className="chips-label">Quick Test Customers:</span>
        {SAMPLE_CUSTOMERS.map((sample) => {
          const isActive = currentCustomer.toLowerCase() === sample.name.toLowerCase();
          return (
            <button
              key={sample.name}
              type="button"
              className={`chip-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleChipClick(sample.name)}
            >
              {sample.isHighlight && <Sparkles size={12} style={{ color: '#f59e0b' }} />}
              {sample.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
