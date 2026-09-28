import React from 'react';
import { AlertTriangle, UserCheck, Clock, Lightbulb, ShieldAlert } from 'lucide-react';

interface CustomerInsightsProps {
  summary: string;
  history: string[];
  customerName: string;
  isLoading: boolean;
}

export const CustomerInsights: React.FC<CustomerInsightsProps> = ({
  summary,
  history,
  customerName,
  isLoading,
}) => {
  const extractInsights = () => {
    const hasData = (summary && summary.trim().length > 0) || history.length > 0;

    if (!hasData) {
      return {
        issues: 'No information available',
        preferences: 'No information available',
        recentProblem: 'No information available',
        tip: `No prior history recorded for ${customerName}`,
      };
    }

    const fullText = (summary + ' ' + history.join(' ')).toLowerCase();

    // 1. Past Issues
    let issues = 'No critical past issues recorded';
    if (fullText.includes('damage') || fullText.includes('broken')) {
      issues = 'Package damaged in transit / physical defect reported';
    } else if (fullText.includes('wrong') || fullText.includes('incorrect')) {
      issues = 'Incorrect item or wrong order received';
    } else if (fullText.includes('delay') || fullText.includes('late')) {
      issues = 'Delivery delay or missing shipment tracking';
    } else if (history.length > 0) {
      issues = `${history.length} logged interaction(s) in memory bank`;
    }

    // 2. Preferences
    let preferences = 'No specific channel preference recorded';
    if (fullText.includes('email')) {
      preferences = 'Contact via EMAIL requested by customer';
    } else if (fullText.includes('phone') || fullText.includes('call')) {
      preferences = 'Phone call follow-up preferred';
    } else if (fullText.includes('chat') || fullText.includes('whatsapp')) {
      preferences = 'Instant Messaging / Chat updates preferred';
    }

    // 3. Recent Problem
    let recentProblem = 'No recent problem logged';
    if (history.length > 0) {
      const lastMsg = history[history.length - 1];
      recentProblem = lastMsg.replace(/^Customer \w+ (said|reported):?/i, '').trim();
      if (recentProblem.length > 100) {
        recentProblem = recentProblem.substring(0, 100) + '...';
      }
    } else if (summary) {
      recentProblem = summary.substring(0, 100) + '...';
    }

    // 4. Support Recommendation
    let tip = `Acknowledge ${customerName}'s prior history immediately without asking them to repeat details.`;
    if (fullText.includes('email')) {
      tip = `Send immediate email confirmation. Customer explicitly requested email contact.`;
    } else if (fullText.includes('damage')) {
      tip = `Prioritize priority replacement/refund dispatch due to damage reports.`;
    }

    return { issues, preferences, recentProblem, tip };
  };

  const insights = extractInsights();

  if (isLoading) {
    return (
      <div className="insights-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="insight-card">
            <div className="skeleton skeleton-text short" />
            <div className="skeleton skeleton-text" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="section-title-group">
        <ShieldAlert size={18} style={{ color: 'var(--accent-indigo)' }} />
        <h3>Key Customer Memory Insights</h3>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon rose">
              <AlertTriangle size={18} />
            </div>
            <span className="insight-title">Past Issues</span>
          </div>
          <div className="insight-value">{insights.issues}</div>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon cyan">
              <UserCheck size={18} />
            </div>
            <span className="insight-title">Preferences</span>
          </div>
          <div className="insight-value">{insights.preferences}</div>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon amber">
              <Clock size={18} />
            </div>
            <span className="insight-title">Recent Problem</span>
          </div>
          <div className="insight-value">{insights.recentProblem}</div>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon emerald">
              <Lightbulb size={18} />
            </div>
            <span className="insight-title">Support Recommendation</span>
          </div>
          <div className="insight-value">{insights.tip}</div>
        </div>
      </div>
    </div>
  );
};
