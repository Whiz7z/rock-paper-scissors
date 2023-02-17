import { Alert } from "@chakra-ui/react";
import React from "react";
import modules from "./Scissors.module.css";

const Scissors = ({ onPlay, isModal, isActive }) => {
  return (
    <div
      onClick={() => {
        if (isModal) {
          return;
        } else if (!isModal && isActive) {
          onPlay(0);
        } else {
          alert("Scissors is not active");
        }
      }}
      className={isModal ? modules.scissorsModal : modules.scissorsItem}
    ></div>
  );
};

export default Scissors;
