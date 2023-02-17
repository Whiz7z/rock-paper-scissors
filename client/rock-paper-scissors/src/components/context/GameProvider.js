import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { useSocket } from "./SocketProvider";
import useSessionStorage from "../hooks/sessionStorage-hook";

export const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [value] = useSessionStorage("userData");
  const [player, setPlayer] = useState(value.username);
  const [opponent, setOpponent] = useState();
  const [playerCount, setPlayerCount] = useState(0);
  const [opponentCount, setOpponentCount] = useState(0);
  const [isMoveMade, setIsMoveMade] = useState(false);

  const [isActive, setIsActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [lastPlayerChoice, setLastPlayerChoice] = useState();
  const [lastOpponentChoice, setLastOpponentChoice] = useState();

  const [whoMoved, setWhoMoved] = useState();

  const socket = useSocket();

  useEffect(() => {
    if (socket == null) return;

    socket.on("winner", (winner, choices) => {
      if (winner.username === player) {
        setPlayerCount((prev) => prev + 1);
      } else if (winner.username === opponent) {
        setOpponentCount((prev) => prev + 1);
      }
      const oppChoice = choices.find((player) => player.username === opponent);

      //setIsMoveMade((prev) => !prev);
      setLastOpponentChoice(oppChoice.choice);
      setShowModal(true);
    });

    return () => socket.off("winner");
  }, [socket, isMoveMade, opponent, player, lastOpponentChoice]);

  useEffect(() => {
    if (socket == null) return;

    socket.on("player-moved", (player) => {
      setWhoMoved(player.username);
    });

    return () => socket.off("winner");
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;

    socket.on("join-player", (playersInTheRoom, reset) => {
      console.log("All players in the room - ", playersInTheRoom);
      setOpponent(playersInTheRoom.filter((opp) => opp !== player)[0]);
      if (reset) {
        setPlayerCount(0);
        setOpponentCount(0);
      }
    });

    console.log("Your opponent is - ", opponent);

    return () => socket.off("join-player");
  }, [socket, player, opponent]);
  ///////////////////////////////////////////

  ////////////////////////////////////////////
  return (
    <GameContext.Provider
      value={{
        opponent,
        player,
        setPlayer,
        setOpponent,
        playerCount,
        setPlayerCount,
        opponentCount,
        setOpponentCount,
        setIsMoveMade,
        lastPlayerChoice,
        setLastPlayerChoice,
        lastOpponentChoice,
        setLastOpponentChoice,
        showModal,
        setShowModal,
        isActive,
        setIsActive,
        whoMoved,
        setWhoMoved,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
