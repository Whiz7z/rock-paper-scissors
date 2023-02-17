import React, { useContext, useRef, useEffect } from "react";

import { Button, UnorderedList, VStack } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

import { Formik } from "formik";
import { AuthContext } from "../context/auth-context";
import RoomItem from "../Player/RoomItem";
import "./MainMenu.css";
import { useSocket } from "../context/SocketProvider";
import { useRooms } from "../context/RoomsProvider";
import axios from "axios";

const MainMenu = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { rooms, setRooms, winrate, setWinrate } = useRooms();
  const roomIdInput = useRef("");
  const { username, userId, logout, isLoggedIn } = useContext(AuthContext);
  // const { logout } = useAuth();

  const createRoomHandler = async () => {
    let existingRoom;
    try {
      existingRoom = rooms.find((room) => room === roomIdInput.current.value);
    } catch (err) {}

    if (
      !existingRoom &&
      roomIdInput.current.value.trim().length > 0 &&
      roomIdInput.current.value.length <= 10
    ) {
      await axios
        .post(process.env.REACT_APP_BACKEND_URL + "/rooms/create/", {
          roomId: roomIdInput.current.value,
        })
        .then((res) => {})
        .catch((err) => {});
    }

    roomIdInput.current.value = "";
  };

  const deleteRoomHandler = async (roomId) => {
    //   const newRooms = rooms.filter((room) => room !== roomId);
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/rooms/`, {
        data: { roomId: roomId },
      })
      .then((res) => {})
      .catch((err) => {});
  };

  const joinRoomHandler = async (roomId, playerId) => {
    if (username) {
      await axios
        .post(process.env.REACT_APP_BACKEND_URL + "/room/join", {
          data: { roomId: roomId, userId: userId },
        })
        .then((res) => {
          socket.emit("join-room", res.data.room.roomId, (cb) => {
            setRooms(cb.rooms);
          });
          if (res.data.isJoined) {
            navigate(`/game/${res.data.room.roomId}`, { raplace: true });
          }
        })
        .catch((err) => {});
    } else {
      navigate("/");
    }
  };

  const logOutHandler = () => {
    logout();
  };

  function percentage(partialValue, totalValue) {
    return ((100 * partialValue) / totalValue).toFixed(2);
  }

  useEffect(() => {
    console.log("is log usrname", isLoggedIn, username);
  }, [isLoggedIn, username]);

  useEffect(() => {
    const sendRequest = async () => {
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/rooms/allrooms/`, {
          userId: userId,
          username: username,
        })
        .then((res) => {
          setWinrate(res.data.winrate);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    sendRequest();
  }, [setWinrate, userId, username, setRooms]);

  return (
    <React.Fragment>
      <Link to={"/"} className={"back-link"} onClick={logOutHandler}>
        Log out
      </Link>
      <VStack
        w={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing="1rem"
      >
        <h1 className="mainmenu-h1">Hey, {<span>{username}</span>}</h1>
        {winrate && (
          <>
            <h1 className="winrate">
              Wins - <span>{winrate.wins}</span> and Loses -{" "}
              <span>{winrate.loses}</span>
            </h1>
            <p className="winrate-cents">
              Win rate -
              <span>
                {` ${percentage(winrate.wins, winrate.wins + winrate.loses)}`}%
              </span>
            </p>
          </>
        )}
        <UnorderedList styleType="none" spacing="0.6rem">
          {rooms &&
            rooms.map((room) => (
              <RoomItem
                key={room.roomId}
                name={room.roomId}
                userId={userId}
                players={room.players}
                onDelete={deleteRoomHandler}
                onJoinRoom={joinRoomHandler}
              />
            ))}
        </UnorderedList>

        <Formik>
          <VStack>
            <input
              ref={roomIdInput}
              name="roomId"
              placeholder="Enter room id"
              autoComplete="on"
              label="Room Id"
              className="create-room-input"
            />
            <Button
              backgroundColor="burlywood"
              borderRadius="none"
              color="#487085"
              fontWeight="bold"
              width="195px"
              onClick={createRoomHandler}
              type="submit"
            >
              Create room
            </Button>
          </VStack>
        </Formik>
      </VStack>
    </React.Fragment>
  );
};

export default MainMenu;
