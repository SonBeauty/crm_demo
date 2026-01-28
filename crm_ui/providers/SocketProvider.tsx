"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    let serverUrl =
      process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:4000";
    serverUrl = serverUrl.replace("/api/v1", "");

    console.log("🔌 Initializing global socket connection to:", serverUrl);

    const socketInstance = io(serverUrl, {
      auth: { token },
      query: { userId: user.id },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Global Socket Connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Global Socket Disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("⚠️ Global Socket Connection Error:", err.message);
    });

    setSocket(socketInstance);

    return () => {
      console.log("🧹 Cleaning up global socket connection");
      socketInstance.disconnect();
    };
  }, [token, user?.id]); // Only re-run if token or user id changes

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
