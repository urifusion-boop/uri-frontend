import { useEffect, useRef, useState, useCallback } from 'react';

export enum WebSocketStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
}

interface UseWebSocketOptions {
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = <T>(
  onMessage: (data: T) => void,
  url?: string,
  options: UseWebSocketOptions = {}
) => {
  const {
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    heartbeatInterval = 30000,
    onOpen,
    onClose,
    onError,
  } = options;

  const socket = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.DISCONNECTED);
  const [lastMessage, setLastMessage] = useState<T | null>(null);

  const clearTimers = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
    }
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    clearTimers();
    heartbeatTimer.current = setInterval(() => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, heartbeatInterval);
  }, [heartbeatInterval, clearTimers]);

  const connect = useCallback(() => {
    if (!url) return;

    try {
      setStatus(WebSocketStatus.CONNECTING);
      socket.current = new WebSocket(url);

      socket.current.onopen = () => {
        console.log('[WebSocket] ✅ Connected');
        setStatus(WebSocketStatus.CONNECTED);
        reconnectCount.current = 0;
        startHeartbeat();
        onOpen?.();
      };

      socket.current.onclose = () => {
        console.log('[WebSocket] 🚫 Closed');
        setStatus(WebSocketStatus.DISCONNECTED);
        clearTimers();
        onClose?.();

        // Attempt reconnection
        if (reconnect && reconnectCount.current < reconnectAttempts) {
          reconnectCount.current++;
          console.log(`[WebSocket] 🔄 Reconnecting... Attempt ${reconnectCount.current}/${reconnectAttempts}`);
          reconnectTimer.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      socket.current.onerror = (e) => {
        console.error('[WebSocket] ❌ Error:', e);
        setStatus(WebSocketStatus.ERROR);
        onError?.(e);
      };

      socket.current.onmessage = (msg: MessageEvent) => {
        try {
          const parsedData: T = JSON.parse(msg.data);

          // Ignore pong messages
          if ((parsedData as any)?.type === 'pong') {
            return;
          }

          setLastMessage(parsedData);
          onMessage(parsedData);
        } catch (error) {
          console.error('[WebSocket] ❌ Failed to parse message:', error);
        }
      };
    } catch (error) {
      console.error('[WebSocket] ❌ Connection error:', error);
      setStatus(WebSocketStatus.ERROR);
    }
  }, [url, reconnect, reconnectAttempts, reconnectInterval, onMessage, onOpen, onClose, onError, startHeartbeat, clearTimers]);

  useEffect(() => {
    connect();

    return () => {
      clearTimers();
      socket.current?.close();
      console.log('[WebSocket] 🔌 Connection closed on cleanup');
    };
  }, [url, connect, clearTimers]);

  const sendMessage = useCallback((message: string | object) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      socket.current.send(messageStr);
    } else {
      console.warn('[WebSocket] ⚠️ Connection not open. Unable to send:', message);
    }
  }, []);

  const disconnect = useCallback(() => {
    clearTimers();
    reconnectCount.current = reconnectAttempts; // Prevent reconnection
    socket.current?.close();
  }, [clearTimers, reconnectAttempts]);

  const reconnectManually = useCallback(() => {
    reconnectCount.current = 0;
    connect();
  }, [connect]);

  return {
    socket: socket.current,
    status,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: reconnectManually,
    isConnected: status === WebSocketStatus.CONNECTED,
    isConnecting: status === WebSocketStatus.CONNECTING,
  };
};
