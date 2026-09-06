import { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const WS_URL = (import.meta.env.VITE_SOCKET_API_URL || 'http://localhost:3001').replace('http', 'ws');

interface EmailOpenedEvent {
  emailHistoryId: string;
  recipient: string;
  openedAt: string;
  userAgent?: string;
  totalOpens: number;
}

// Global state to prevent multiple connections
let globalWs: WebSocket | null = null;
let globalOrgId: string | null = null;
let connectionCount = 0;
const listeners = new Set<(data: EmailOpenedEvent) => void>();

/**
 * Hook to connect to WebSocket and listen for email tracking events
 * Uses a singleton pattern to ensure only one WebSocket connection exists
 */
export function useEmailTracking(organizationId: string | undefined, onEmailOpened?: (data: EmailOpenedEvent) => void) {
  const { t } = useTranslation();
  const listenerRef = useRef(onEmailOpened);
  

  // Keep listener ref up to date
  useEffect(() => {
    listenerRef.current = onEmailOpened;
  }, [onEmailOpened]);

  useEffect(() => {
     if (!organizationId) return;

    connectionCount++;
 
    // Add listener
    const listener = (data: EmailOpenedEvent) => {
      if (listenerRef.current) {
        listenerRef.current(data);
      }
    };
    listeners.add(listener);

    const connect = () => {
      if (listeners.size === 0 || !globalOrgId) return;

      const ws = new WebSocket(`${WS_URL}/ws`);
      globalWs = ws;

      ws.onopen = () => {
        if (ws.readyState !== WebSocket.OPEN || globalWs !== ws) return;

        ws.send(JSON.stringify({
          type: 'join:user',
          userId: organizationId,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'email:opened') {
            const data: EmailOpenedEvent = message.data;
            toast.success(t('email_opened_message', { recipient: data.recipient, count: data.totalOpens }));
            listeners.forEach(cb => cb(data));
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
      };

      ws.onclose = (event) => {
        if (globalWs === ws) globalWs = null;

        if (listeners.size > 0 && event.code !== 1000 && globalOrgId) {
          setTimeout(() => {
            if (!globalWs && listeners.size > 0 && globalOrgId) connect();
          }, 3000);
        }
      };
    };

    // Create or reuse connection
    if (!globalWs || globalWs.readyState === WebSocket.CLOSED || globalWs.readyState === WebSocket.CLOSING) {
      globalOrgId = organizationId;
      connect();
    } else if (globalOrgId !== organizationId && globalWs.readyState === WebSocket.OPEN) {
      // Organization changed, rejoin
       globalOrgId = organizationId;
      globalWs.send(JSON.stringify({
        type: 'join:organization',
        organizationId,
      }));
    }

    // Cleanup
    return () => {
      connectionCount--;
       listeners.delete(listener);
      
      // Close connection only if no more listeners
      if (listeners.size === 0 && globalWs) {
         globalWs.close(1000, 'No more listeners');
        globalWs = null;
        globalOrgId = null;
      }
    };
  }, [organizationId]);

  const disconnect = useCallback(() => {
    if (globalWs) {
      globalWs.close(1000, 'Manual disconnect');
      globalWs = null;
      globalOrgId = null;
      listeners.clear();
    }
  }, []);

  return { disconnect };
}