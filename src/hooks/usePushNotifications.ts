import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (err) {
      console.error('[Push] Error requesting permission:', err);
      setError('Failed to request notification permission');
      return false;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    try {
      if (!isSupported) {
        setError('Push notifications are not supported in this browser');
        return false;
      }

      // Request permission if not granted
      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Notification permission denied');
          return false;
        }
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      console.log('[Push] Service Worker registered');

      // Check for existing subscription and unsubscribe if it exists
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('[Push] Unsubscribing from old subscription');
        await existingSubscription.unsubscribe();
      }

      // Get VAPID public key from backend
      const { data: vapidData } = await axios.get<{ publicKey: string }>(
        `${API_URL}/user/vapid-public-key`,
        { withCredentials: true }
      );

      if (!vapidData?.publicKey) {
        throw new Error('No VAPID public key received from server');
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey) as BufferSource,
      });

      console.log('[Push] Subscribed:', subscription);

      // Send subscription to backend
      await axios.post(
        `${API_URL}/user/push-subscription`,
        { subscription: subscription.toJSON() },
        { withCredentials: true }
      );

      setIsSubscribed(true);
      setError(null);
      return true;
    } catch (err: any) {
      console.error('[Push] Error subscribing:', err);
      setError(err.message || 'Failed to subscribe to push notifications');
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        console.log('[Push] Unsubscribed');
      }

      setIsSubscribed(false);
      setError(null);
      return true;
    } catch (err: any) {
      console.error('[Push] Error unsubscribing:', err);
      setError(err.message || 'Failed to unsubscribe from push notifications');
      return false;
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    error,
    subscribe,
    unsubscribe,
    requestPermission,
  };
}
