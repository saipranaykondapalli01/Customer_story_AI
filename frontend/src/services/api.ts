// CustomerStory AI API Service

const BASE_URL = 'http://127.0.0.1:8000';

export interface CustomerMessageRequest {
  customer_name: string;
  message: string;
}

export interface CustomerMessageResponse {
  message: string;
  customer: string;
}

export interface CustomerHistoryResponse {
  customer: string;
  history: string[];
}

export interface CustomerSummaryResponse {
  customer: string;
  summary: string;
}

export interface SystemHealthResponse {
  message: string;
}

/**
 * Fetch wrapper targeting primary API base URL http://127.0.0.1:8000
 * with fallback to Vite proxy /api for browser dev environments.
 * Logs all errors to browser console for debugging.
 */
async function fetchWithFallback<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const directUrl = `${BASE_URL}${endpoint}`;
  const proxyUrl = `/api${endpoint}`;

  // 1. Try Direct Backend URL (http://127.0.0.1:8000)
  try {
    const response = await fetch(directUrl, options);
    if (response.ok) {
      return await response.json();
    }
  } catch (directErr) {
    console.warn(`[API Direct] Direct call to ${directUrl} failed, trying proxy fallback...`, directErr);
  }

  // 2. Try Vite Proxy (/api)
  try {
    const proxyResponse = await fetch(proxyUrl, options);
    if (proxyResponse.ok) {
      return await proxyResponse.json();
    }
    const errText = await proxyResponse.text().catch(() => '');
    const err = new Error(`API HTTP ${proxyResponse.status}: ${errText}`);
    console.error(`[API Error] Request failed for ${endpoint}:`, err);
    throw err;
  } catch (proxyErr) {
    console.error(`[API Error] All connection attempts failed for ${endpoint}:`, proxyErr);
    throw proxyErr;
  }
}

export const api = {
  /**
   * Health check endpoint to verify backend status
   */
  async checkHealth(): Promise<boolean> {
    try {
      const data = await fetchWithFallback<SystemHealthResponse>('/');
      return Boolean(data && data.message);
    } catch (err) {
      console.error('[Health Check Failed]:', err);
      return false;
    }
  },

  /**
   * Save a new customer interaction
   * POST /customer/message
   */
  async saveMessage(customerName: string, message: string): Promise<CustomerMessageResponse> {
    return fetchWithFallback<CustomerMessageResponse>('/customer/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName,
        message: message,
      }),
    });
  },

  /**
   * Get interaction history for a customer
   * GET /customer/{customer_name}/history
   */
  async getHistory(customerName: string): Promise<CustomerHistoryResponse> {
    const encodedName = encodeURIComponent(customerName.trim());
    const data = await fetchWithFallback<any>(`/customer/${encodedName}/history`);
    
    let historyList: string[] = [];
    if (data && Array.isArray(data.history)) {
      historyList = data.history;
    } else if (Array.isArray(data)) {
      historyList = data;
    } else if (data && Array.isArray(data.memories)) {
      historyList = data.memories;
    }

    return {
      customer: customerName,
      history: historyList,
    };
  },

  /**
   * Get AI-generated summary story for a customer
   * GET /customer/{customer_name}/summary
   */
  async getSummary(customerName: string): Promise<CustomerSummaryResponse> {
    const encodedName = encodeURIComponent(customerName.trim());
    const data = await fetchWithFallback<any>(`/customer/${encodedName}/summary`);
    
    let summaryText = '';
    if (data && typeof data.summary === 'string') {
      summaryText = data.summary;
    } else if (typeof data === 'string') {
      summaryText = data;
    } else if (data && typeof data.story === 'string') {
      summaryText = data.story;
    }

    return {
      customer: customerName,
      summary: summaryText,
    };
  },
};
