import React, { useState } from 'react';
import { History, MessageSquare, Copy, Check, MessageCircleOff } from 'lucide-react';

interface InteractionHistoryProps {
  customerName: string;
  history: string[];
  isLoading: boolean;
}

export const InteractionHistory: React.FC<InteractionHistoryProps> = ({
  customerName,
  history,
  isLoading,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="history-card">
      <div className="section-title-group" style={{ marginBottom: '0.5rem' }}>
        <History size={18} style={{ color: 'var(--accent-indigo)' }} />
        <h3>Interaction History Timeline</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {history.length} Memory Records
        </span>
      </div>

      {isLoading ? (
        <div style={{ padding: '1rem 0' }}>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text short" />
        </div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          <MessageCircleOff size={32} style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: '0.9rem' }}>No logged interactions found for <strong>{customerName}</strong>.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Use the "Add New Interaction" panel to add the first message.
          </p>
        </div>
      ) : (
        <div className="timeline-list">
          {history.map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-bullet">#{idx + 1}</div>
              <div className="timeline-box">
                <div className="timeline-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MessageSquare size={13} style={{ color: 'var(--accent-purple)' }} />
                    Interaction #{idx + 1}
                  </span>
                  <button
                    onClick={() => handleCopy(item, idx)}
                    className="btn-icon"
                    style={{ width: 26, height: 26 }}
                    title="Copy memory snippet"
                  >
                    {copiedIndex === idx ? (
                      <Check size={13} style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
                <div className="timeline-text">{item}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
