import { useSocketContext } from "@/providers/SocketProvider";

export const useSocket = () => {
  const { socket } = useSocketContext();
  return socket;
};
