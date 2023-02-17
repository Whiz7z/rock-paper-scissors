import React, { useState, useContext, useCallback, useEffect } from "react";
import modules from "./Side.module.css";
import Rock from "../Rock/Rock";
import Paper from "../Paper/Paper";
import Scissors from "../Scissors/Scissors";
import { GameContext } from "../context/GameProvider";
import { AuthContext } from "../context/auth-context";
import Modal from "../Modal/Modal";

import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { useGame } from "../context/GameProvider";

//scissors === 0
//paper === 1
// rock === 2

const Side = ({ isPlayer }) => {
  const {
    opponent,
    playerCount,
    opponentCount,
    setIsMoveMade,
    setLastPlayerChoice,
    lastOpponentChoice,
    lastPlayerChoice,
    showModal,
    setShowModal,
    isActive,
    setIsActive,
    whoMoved,
    setWhoMoved,
  } = useGame();
  const socket = useSocket();

  const { userId, username } = useContext(AuthContext);
  const params = useParams();
  const roomId = params.roomId;
  // function getRandomInt(max) {
  //   return Math.floor(Math.random() * max);
  // }

  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setIsActive(true);
    setWhoMoved(null);
  }, [setShowModal, setIsActive, setWhoMoved]);

  const playHandler = useCallback(
    (choice) => {
      //setIsMoveMade(true);
      if (isActive) {
        setIsActive(false);
        setLastPlayerChoice(choice);
        socket.emit("make-move", {
          choice: choice,
          username: username,
          roomId: roomId,
        });
      }
    },
    [username, roomId, socket, setLastPlayerChoice, setIsActive, isActive]
  );

  useEffect(() => {
    if (opponent === undefined) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }, [opponent, setIsActive]);

  return (
    <div className={modules.side_wapper}>
      <p className={modules.isMoved}>
        {opponent && !isPlayer && whoMoved === opponent
          ? "Opponent made a move"
          : ""}
      </p>
      <h1
        className={`${modules.player}  ${!isPlayer && modules.opponent}  ${
          !isPlayer && whoMoved === opponent && modules.moved
        }`}
      >
        {isPlayer ? username : opponent}
      </h1>
      <h2 className={modules.score}>
        {isPlayer ? playerCount : opponentCount}
      </h2>
      {isPlayer && (
        <div className={modules.equipment}>
          <Scissors
            onPlay={isPlayer && playHandler}
            isActive={isActive}
          ></Scissors>
          <Rock onPlay={isPlayer && playHandler} isActive={isActive}></Rock>
          <Paper onPlay={isPlayer && playHandler} isActive={isActive}></Paper>
        </div>
      )}

      {showModal && (
        <Modal
          onClose={closeModalHandler}
          player={lastPlayerChoice}
          opp={lastOpponentChoice}
        />
      )}
    </div>
  );
};

export default Side;
