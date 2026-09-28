import React from 'react';
import { Sparkles, Brain } from 'lucide-react';

interface EmptyStateProps {
  onSelectSample: (name: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectSample }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-box">
        <Brain size={32} />
      </div>

      <h3>No Customer Profile Selected</h3>
      <p>
        Search for a customer name above or click below to explore AI memory consolidation, past issue timeline, and customer preferences.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          onClick={() => onSelectSample('Rahul')}
        >
          <Sparkles size={16} /> Load "Rahul" Demo
        </button>
      </div>
    </div>
  );
};
