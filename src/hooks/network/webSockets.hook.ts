import { useEffect, useRef } from 'react';

export const useWebSocket = <T>(onMessage: (data: T) => void, url?: string) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    socket.current = new WebSocket(url);

    socket.current.onopen = () => console.log('[WebSocket] ✅ Connected');

    socket.current.onclose = () => console.log('[WebSocket] 🚫 Closed');

    socket.current.onerror = (e) => console.error('[WebSocket] ❌ Error:', e);

    socket.current.onmessage = (msg: MessageEvent) => {
      try {
        const parsedData: T = JSON.parse(msg.data);
        onMessage(parsedData);
      } catch (error) {
        console.error('[WebSocket] ❌ Failed to parse message:', error);
      }
    };

    return () => {
      socket.current?.close();
      console.log('[WebSocket] 🔌 Connection closed on cleanup');
    };
  });

  const sendMessage = (message: string) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(message);
    } else {
      console.warn('[WebSocket] ⚠️ Connection not open. Unable to send:', message);
    }
  };

  return { socket: socket.current, sendMessage };
};
