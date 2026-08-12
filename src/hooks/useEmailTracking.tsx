import { useEffect, useCallback, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import { IconEye } from '@tabler/icons-react';

const WS_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace('http', 'ws');

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
  const listenerRef = useRef(onEmailOpened);

  // Keep listener ref up to date
  useEffect(() => {
    listenerRef.current = onEmailOpened;
  }, [onEmailOpened]);

  useEffect(() => {
    if (!organizationId) return;

    connectionCount++;
    console.log(`[WebSocket] Hook mounted (${connectionCount} instances)`);

    // Add listener
    const listener = (data: EmailOpenedEvent) => {
      if (listenerRef.current) {
        listenerRef.current(data);
      }
    };
    listeners.add(listener);

    // Create or reuse connection
    if (!globalWs || globalWs.readyState === WebSocket.CLOSED || globalWs.readyState === WebSocket.CLOSING) {
      console.log('[WebSocket] Creating new connection');
      globalOrgId = organizationId;
      
      const ws = new WebSocket(`${WS_URL}/ws`);
      globalWs = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected to server');
        
        // Join organization room
        ws.send(JSON.stringify({
          type: 'join:organization',
          organizationId,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'email:opened') {
            const data: EmailOpenedEvent = message.data;
            console.log('[WebSocket] Email opened:', data);

            // Show notification
            notifications.show({
              title: '📧 Email ouvert',
              message: `${data.recipient} a ouvert votre email (${data.totalOpens}x)`,
              color: 'blue',
              icon: <IconEye size={16} />,
              autoClose: 5000,
            });

            // Notify all listeners
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
        console.log('[WebSocket] Disconnected from server', event.code, event.reason);
        globalWs = null;
        
        // Only reconnect if we still have listeners and it wasn't a normal closure
        if (listeners.size > 0 && event.code !== 1000 && globalOrgId) {
          setTimeout(() => {
            console.log('[WebSocket] Attempting to reconnect...');
            // Trigger reconnection by creating new connection
            if (listeners.size > 0 && globalOrgId) {
              const newWs = new WebSocket(`${WS_URL}/ws`);
              globalWs = newWs;
              // Copy handlers
              newWs.onopen = ws.onopen;
              newWs.onmessage = ws.onmessage;
              newWs.onerror = ws.onerror;
              newWs.onclose = ws.onclose;
            }
          }, 3000);
        }
      };
    } else if (globalOrgId !== organizationId) {
      // Organization changed, rejoin
      console.log('[WebSocket] Organization changed, rejoining');
      globalOrgId = organizationId;
      globalWs.send(JSON.stringify({
        type: 'join:organization',
        organizationId,
      }));
    }

    // Cleanup
    return () => {
      connectionCount--;
      console.log(`[WebSocket] Hook unmounted (${connectionCount} instances remaining)`);
      listeners.delete(listener);
      
      // Close connection only if no more listeners
      if (listeners.size === 0 && globalWs) {
        console.log('[WebSocket] No more listeners, closing connection');
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
