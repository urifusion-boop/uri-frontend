import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { ConnectionStatusDto, RealtimeLeadDto, RealtimeLeadNotificationDto } from '@/models/dtos/RealtimeLeadDto';
import { useAuth } from '@/providers/AuthProvider';
import { useCallback, useRef, useState } from 'react';
import { useWebSocket, WebSocketStatus } from '../network/webSockets.hook';

interface UseRealtimeLeadsOptions {
  userId?: string;
  leadFormId?: string;
  onNewLead?: (lead: RealtimeLeadDto) => void;
  autoConnect?: boolean;
}

export const useRealtimeLeads = (options: UseRealtimeLeadsOptions = {}) => {
  const { userId, leadFormId, onNewLead, autoConnect = true } = options;
  const wsDisabled = true;
  const { tokenDetails } = useAuth();

  const [realtimeLeads, setRealtimeLeads] = useState<RealtimeLeadDto[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusDto | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastErrorToastRef = useRef<number>(0);

  // Construct WebSocket URL based on environment
  const getWebSocketUrl = useCallback(() => {
    if (typeof window === 'undefined' || !userId || !autoConnect || wsDisabled) return undefined;

    const apiBase = process.env.NEXT_PUBLIC_URI_API_BASE_URL || window.location.origin;
    const parsed = new URL(apiBase);
    const wsScheme = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
    const baseUrl = `${wsScheme}//${parsed.host}/uri-insights`;

    const url = new URL(`${baseUrl}/ws/leads/${userId}`);
    if (leadFormId) url.searchParams.set('lead_form_id', leadFormId);
    if (tokenDetails?.accessToken) url.searchParams.set('token', tokenDetails.accessToken);

    return url.toString();
  }, [userId, leadFormId, autoConnect, tokenDetails?.accessToken, wsDisabled]);

  const handleMessage = useCallback(
    (notification: RealtimeLeadNotificationDto) => {
      console.log('[RealtimeLeads] Received notification:', notification);

      switch (notification.type) {
        case 'new_lead':
          const newLead = notification.data as RealtimeLeadDto;
          setRealtimeLeads((prev) => [newLead, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show toast notification
          triggerToast('success', `New lead from ${newLead.source.author_name}!`);

          // Invalidate relevant queries so stats and lists auto-update
          queryClient.invalidateQueries({ queryKey: ['leads-data'] });
          queryClient.invalidateQueries({ queryKey: ['lead-analytics'] });
          queryClient.invalidateQueries({ queryKey: ['leads-business-info'] });
          queryClient.invalidateQueries({ queryKey: ['leads-kanban-data'] });
          queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

          // Call custom handler
          onNewLead?.(newLead);
          break;

        case 'lead_update':
          const updatedLead = notification.data as RealtimeLeadDto;
          setRealtimeLeads((prev) => prev.map((lead) => (lead.lead_id === updatedLead.lead_id ? updatedLead : lead)));

          // Invalidate queries on lead updates too (e.g., status changes)
          queryClient.invalidateQueries({ queryKey: ['leads-data'] });
          queryClient.invalidateQueries({ queryKey: ['lead-analytics'] });
          queryClient.invalidateQueries({ queryKey: ['leads-kanban-data'] });
          break;

        case 'connection_status':
          const status = notification.data as ConnectionStatusDto;
          setConnectionStatus(status);

          if (status.status === 'connected') {
            triggerToast('success', 'Connected to real-time lead monitoring');
          } else if (status.status === 'error') {
            triggerToast('error', status.message || 'Connection error');
          }
          break;

        default:
          console.warn('[RealtimeLeads] Unknown notification type:', notification.type);
      }
    },
    [onNewLead]
  );

  const { status, isConnected, isConnecting, sendMessage, disconnect, reconnect } = useWebSocket<RealtimeLeadNotificationDto>(handleMessage, getWebSocketUrl(), {
    reconnect: true,
    reconnectInterval: 5000,
    reconnectAttempts: 2,
    onOpen: () => {
      console.log('[RealtimeLeads] WebSocket connected');
      // Subscribe to specific lead form if provided
      if (leadFormId) {
        sendMessage({ type: 'subscribe', lead_form_id: leadFormId });
      }
    },
    onClose: () => {
      console.log('[RealtimeLeads] WebSocket closed');
    },
    onError: (error: Event) => {
      if (wsDisabled) return;
      console.error('[RealtimeLeads] WebSocket error:', error);
      const now = Date.now();
      if (now - lastErrorToastRef.current > 20000) {
        triggerToast('error', 'Connection to real-time service lost');
        lastErrorToastRef.current = now;
      }
    },
  });

  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearLeads = useCallback(() => {
    setRealtimeLeads([]);
    setUnreadCount(0);
  }, []);

  const subscribeToLeadForm = useCallback(
    (formId: string) => {
      sendMessage({ type: 'subscribe', lead_form_id: formId });
    },
    [sendMessage]
  );

  const unsubscribeFromLeadForm = useCallback(
    (formId: string) => {
      sendMessage({ type: 'unsubscribe', lead_form_id: formId });
    },
    [sendMessage]
  );

  return {
    // Data
    realtimeLeads,
    unreadCount,
    connectionStatus,

    // Connection state
    status,
    isConnected,
    isConnecting,
    isDisconnected: status === WebSocketStatus.DISCONNECTED,

    // Actions
    clearUnreadCount,
    clearLeads,
    disconnect,
    reconnect,
    subscribeToLeadForm,
    unsubscribeFromLeadForm,
  };
};
