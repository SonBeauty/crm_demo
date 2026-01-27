import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) return;
    console.log(process.env.SERVER);
    const socketInstance = io(process.env.SERVER! || "http://localhost:4000", {
      auth: { token },
      query: { userId: user?.id },
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Connected to socket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, user]);

  return socket;
};
