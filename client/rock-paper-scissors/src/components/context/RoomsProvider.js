import { useState, useEffect, createContext, useContext } from "react";
import { useSocket } from "./SocketProvider";
import { AuthContext } from "./auth-context";
import { useAuth } from "../hooks/auth-hook";
import axios from "axios";

const RoomsContext = createContext();

export function useRooms() {
  return useContext(RoomsContext);
}

export function RoomsProvider({ children }) {
  const { username, userId } = useContext(AuthContext);
  const [rooms, setRooms] = useState();
  const [winrate, setWinrate] = useState();

  const socket = useSocket();

  useEffect(() => {
    const sendRequest = async () => {
      console.log(userId, username);
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/rooms/allrooms/`, {
          userId: userId,
          username: username,
        })
        .then((res) => {
          setRooms(res.data.rooms);
          setWinrate(res.data.winrate);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    sendRequest();
  }, [setWinrate, username, userId]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("create-room", (room) => {
      setRooms((prev) => [...prev, room]);
    });
    return () => socket.off("create-room");
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("room-deleted", (roomsAfterDeleting) => {
      setRooms(roomsAfterDeleting);
    });
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("get-all-rooms", (allRooms) => {
      setRooms(allRooms);
    });

    return () => socket.off("get-all-rooms");
  }, [socket]);

  useEffect(() => {
    console.log("rooooooooooms", rooms);
  }, [rooms]);

  return (
    <RoomsContext.Provider value={{ rooms, setRooms, winrate, setWinrate }}>
      {children}
    </RoomsContext.Provider>
  );
}
