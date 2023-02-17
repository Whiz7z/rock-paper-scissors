import React from "react";
import modules from "./Rock.module.css";
const Rock = ({ onPlay, isModal, isActive }) => {
  return (
    <div
      onClick={() => {
        if (isModal) {
          return;
        } else if (isActive) {
          onPlay(2);
        } else {
          alert("Rock is not active");
        }
      }}
      className={isModal ? modules.rockModal : modules.rockItem}
    ></div>
  );
};

export default Rock;
