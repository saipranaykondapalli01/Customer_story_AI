import React, { useState } from 'react';
import { BookOpen, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

interface CustomerStoryCardProps {
  customerName: string;
  summary: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export const CustomerStoryCard: React.FC<CustomerStoryCardProps> = ({
  customerName,
  summary,
  isLoading,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="story-card">
      <div className="story-header">
        <div className="story-title-group">
          <BookOpen size={22} style={{ color: 'var(--accent-purple)' }} />
          <h2>AI Customer Story</h2>
          <span className="customer-name-tag">{customerName}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {summary && (
            <button
              onClick={handleCopy}
              className="btn-icon"
              title="Copy customer story summary"
            >
              {copied ? <Check size={16} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={16} />}
            </button>
          )}
          <button
            onClick={onRefresh}
            className="btn-icon"
            disabled={isLoading}
            title="Refresh AI story summary"
          >
            <RefreshCw size={16} className={isLoading ? 'spinner' : ''} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="story-content-body">
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text short" />
        </div>
      ) : summary ? (
        <div className="story-content-body">
          {summary}
        </div>
      ) : (
        <div className="story-content-body" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No summary story generated yet. Add a message below to build {customerName}'s story.
        </div>
      )}

      <div className="story-footer-meta">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={13} style={{ color: 'var(--accent-purple)' }} />
          Consolidated with Groq LLM &amp; Hindsight Memory
        </span>
        <span>Real-time Support Memory</span>
      </div>
    </div>
  );
};
