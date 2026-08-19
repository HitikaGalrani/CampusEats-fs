import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/');

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('⚡ Socket.IO Connected:', socket.id);
      setIsConnected(true);

      if (user && user._id) {
        socket.emit('join_user', user._id);
      }

      if (isAdmin) {
        socket.emit('join_admin');
      }
    });

    socket.on('disconnect', () => {
      console.log('⚡ Socket.IO Disconnected');
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user?._id, isAdmin]);

  const joinOrderRoom = (orderId) => {
    if (socketRef.current && orderId) {
      socketRef.current.emit('join_order', orderId);
    }
  };

  const leaveOrderRoom = (orderId) => {
    if (socketRef.current && orderId) {
      socketRef.current.emit('leave_order', orderId);
    }
  };

  const onEvent = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  };

  const offEvent = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.off(eventName, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinOrderRoom,
    leaveOrderRoom,
    onEvent,
    offEvent,
  };
};
