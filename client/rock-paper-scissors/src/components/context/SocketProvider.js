import { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider = ({ id, children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL, { query: { id } });

    setSocket(newSocket);
    return () => newSocket.close();
  }, [id]);

  useSocket(() => {
    console.log(socket.id);
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
