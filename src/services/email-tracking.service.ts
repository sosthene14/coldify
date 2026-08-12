import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface OpenStats {
  totalOpens: number;
  uniqueOpens: number;
  firstOpenedAt?: string;
  lastOpenedAt?: string;
}

export interface OpenDetail {
  id: string;
  recipient: string;
  openedAt: string;
  userAgent?: string;
}

export const emailTrackingService = {
  /**
   * Get open statistics for an email
   */
  async getOpenStats(emailHistoryId: string): Promise<OpenStats> {
    const response = await axios.get(`${API_URL}/api/track/stats/${emailHistoryId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Get detailed open events for an email
   */
  async getOpenDetails(emailHistoryId: string): Promise<OpenDetail[]> {
    const response = await axios.get(`${API_URL}/api/track/details/${emailHistoryId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
