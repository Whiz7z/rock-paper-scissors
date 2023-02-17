import React, { useEffect, useContext } from "react";
import Division from "../Division/Division";
import Side from "../Side/Side";
import { useParams, Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth-context";
import { GameProvider } from "../context/GameProvider";
import { useSocket } from "../context/SocketProvider";

import "../../app.css";

const Game = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { username } = useContext(AuthContext);
  const params = useParams();
  const roomId = params.roomId;

  const exitRoomHandler = () => {
    socket.emit("exit-room", roomId);
    console.log("username", username);
  };

  useEffect(() => {
    if (socket == null) return;

    socket.emit("player-joined", roomId, username);
  }, [roomId, socket, username]);

  return (
    <GameProvider>
      <div className="game-container">
        <div className="game-id">room id: {roomId}</div>
        <Link
          to="/mainmenu"
          role="button"
          className={"back-link"}
          onClick={exitRoomHandler}
        >
          Back to main menu
        </Link>
        <Side isPlayer={true} />
        <Division roomId={roomId} />
        <Side isPlayer={false} />
      </div>
    </GameProvider>
  );
};

export default Game;
