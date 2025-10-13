import { useState, useCallback, useEffect } from 'react';
import { useWebSocket, WebSocketStatus } from '../network/webSockets.hook';
import { RealtimeLeadDto, RealtimeLeadNotificationDto, ConnectionStatusDto } from '@/models/dtos/RealtimeLeadDto';
import { triggerToast } from '@/components/atoms/CustomToast';

interface UseRealtimeLeadsOptions {
  userId?: string;
  leadFormId?: string;
  onNewLead?: (lead: RealtimeLeadDto) => void;
  autoConnect?: boolean;
}

export const useRealtimeLeads = (options: UseRealtimeLeadsOptions = {}) => {
  const { userId, leadFormId, onNewLead, autoConnect = true } = options;

  const [realtimeLeads, setRealtimeLeads] = useState<RealtimeLeadDto[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusDto | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Construct WebSocket URL based on environment
  const getWebSocketUrl = useCallback(() => {
    if (!userId || !autoConnect) return undefined;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || `${wsProtocol}//${window.location.host}`;

    let url = `${baseUrl}/ws/leads/${userId}`;
    if (leadFormId) {
      url += `?lead_form_id=${leadFormId}`;
    }

    return url;
  }, [userId, leadFormId, autoConnect]);

  const handleMessage = useCallback((notification: RealtimeLeadNotificationDto) => {
    console.log('[RealtimeLeads] Received notification:', notification);

    switch (notification.type) {
      case 'new_lead':
        const newLead = notification.data as RealtimeLeadDto;
        setRealtimeLeads((prev) => [newLead, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast notification
        triggerToast('success', `New lead from ${newLead.source.author_name}!`);

        // Call custom handler
        onNewLead?.(newLead);
        break;

      case 'lead_update':
        const updatedLead = notification.data as RealtimeLeadDto;
        setRealtimeLeads((prev) =>
          prev.map((lead) =>
            lead.lead_id === updatedLead.lead_id ? updatedLead : lead
          )
        );
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
  }, [onNewLead]);

  const {
    status,
    isConnected,
    isConnecting,
    sendMessage,
    disconnect,
    reconnect,
  } = useWebSocket<RealtimeLeadNotificationDto>(
    handleMessage,
    getWebSocketUrl(),
    {
      reconnect: true,
      reconnectInterval: 3000,
      reconnectAttempts: 5,
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
      onError: (error) => {
        console.error('[RealtimeLeads] WebSocket error:', error);
        triggerToast('error', 'Connection to real-time service lost');
      },
    }
  );

  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearLeads = useCallback(() => {
    setRealtimeLeads([]);
    setUnreadCount(0);
  }, []);

  const subscribeToLeadForm = useCallback((formId: string) => {
    sendMessage({ type: 'subscribe', lead_form_id: formId });
  }, [sendMessage]);

  const unsubscribeFromLeadForm = useCallback((formId: string) => {
    sendMessage({ type: 'unsubscribe', lead_form_id: formId });
  }, [sendMessage]);

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
