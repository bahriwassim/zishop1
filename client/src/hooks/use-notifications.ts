import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

// Dynamic import for socket.io-client to avoid build issues
let io: any = null;
let Socket: any = null;

const loadSocketIO = async () => {
  if (!io) {
    const socketModule = await import('socket.io-client');
    io = socketModule.io;
    Socket = socketModule.Socket;
  }
  return { io, Socket };
};

export interface Notification {
  type: string;
  title: string;
  message: string;
  timestamp: string;
  orderId?: number;
  orderNumber?: string;
  status?: string;
}

export function useNotifications(userType: string, entityId?: number, userId?: number) {
  const [socket, setSocket] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initSocket = async () => {
      try {
        const { io } = await loadSocketIO();
        
        // Initialize socket connection
                 const newSocket = io('http://localhost:3000', {
           transports: ['websocket', 'polling'],
           autoConnect: true,
         });

        newSocket.on('connect', () => {
          console.log('[NOTIFICATIONS] Connected to WebSocket server');
          setIsConnected(true);
          
          // Join appropriate room based on user type
          newSocket.emit('join_room', { userType, entityId, userId });
        });

        newSocket.on('disconnect', () => {
          console.log('[NOTIFICATIONS] Disconnected from WebSocket server');
          setIsConnected(false);
        });

        newSocket.on('notification', (notification: Notification) => {
          console.log('[NOTIFICATIONS] Received notification:', notification);
          
          // Add to notifications list
          setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50 notifications
          
          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
        });

        newSocket.on('connect_error', (error) => {
          console.error('[NOTIFICATIONS] Connection error:', error);
        });

        setSocket(newSocket);
      } catch (error) {
        console.error('[NOTIFICATIONS] Failed to load socket.io-client:', error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userType, entityId, userId, toast]);

  const markAsRead = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const sendTestNotification = () => {
    if (socket) {
      socket.emit('test_notification');
    }
  };

  return {
    notifications,
    isConnected,
    markAsRead,
    clearAll,
    sendTestNotification,
    unreadCount: notifications.length
  };
} 