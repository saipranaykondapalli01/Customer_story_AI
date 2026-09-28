import React, { useState, useEffect } from 'react';
import { Send, PlusCircle, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface AddInteractionFormProps {
  currentCustomer: string;
  onSuccess: (savedCustomerName: string) => void;
}

const PRESET_MESSAGES = [
  "My package was damaged again. Please contact me by email.",
  "I received order #9823 yesterday but the size is too small. Please issue a replacement.",
  "Please update my contact email to user@example.com for all future order updates.",
  "Customer called regarding delayed delivery. Agent promised express delivery by tomorrow.",
];

export const AddInteractionForm: React.FC<AddInteractionFormProps> = ({
  currentCustomer,
  onSuccess,
}) => {
  const [customerName, setCustomerName] = useState(currentCustomer || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentCustomer) {
      setCustomerName(currentCustomer);
    }
  }, [currentCustomer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setToastMessage(null);
    setErrorMessage(null);

    try {
      const result = await api.saveMessage(customerName.trim(), message.trim());
      setToastMessage(result.message || 'Customer interaction saved successfully!');
      setMessage('');
      
      // Auto refresh history and summary in parent component immediately
      onSuccess(customerName.trim());

      // Secondary quick refresh to guarantee Hindsight memory index catch-up
      setTimeout(() => {
        onSuccess(customerName.trim());
      }, 400);

      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save interaction. Please check if FastAPI backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = (presetText: string) => {
    setMessage(presetText);
  };

  return (
    <div className="add-interaction-card">
      <div className="section-title-group" style={{ marginBottom: '1.25rem' }}>
        <PlusCircle size={18} style={{ color: 'var(--accent-indigo)' }} />
        <h3>Log New Customer Interaction</h3>
      </div>

      {toastMessage && (
        <div className="toast-success">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="error-banner" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <AlertCircle size={16} style={{ color: '#f87171', marginTop: 2 }} />
          <div style={{ fontSize: '0.85rem' }}>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="form-customer-name">Customer Name</label>
          <input
            id="form-customer-name"
            type="text"
            className="form-input"
            placeholder="Customer name (e.g. Rahul)..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="form-customer-message">Customer Message / Support Note</label>
          <textarea
            id="form-customer-message"
            className="form-textarea"
            placeholder="Type customer complaint, request, preference, or interaction message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Quick Sample Prompts:
          </span>
          <div className="preset-prompts">
            {PRESET_MESSAGES.map((preset, index) => (
              <button
                key={index}
                type="button"
                className="prompt-btn"
                onClick={() => handleApplyPreset(preset)}
              >
                <Sparkles size={11} style={{ color: 'var(--accent-purple)', display: 'inline', marginRight: 4 }} />
                "{preset}"
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%' }}
          disabled={isSubmitting || !customerName.trim() || !message.trim()}
        >
          {isSubmitting ? (
            <>
              <div className="spinner" /> Saving Interaction &amp; Retaining Memory...
            </>
          ) : (
            <>
              <Send size={16} /> Save Interaction to Memory
            </>
          )}
        </button>
      </form>
    </div>
  );
};
