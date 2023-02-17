import React from "react";
import modules from "./Paper.module.css";
const Paper = ({ onPlay, isModal, isActive }) => {
  return (
    <div
      onClick={() => {
        if (isModal) {
          return;
        } else if (!isModal && isActive) {
          onPlay(1);
        } else {
          alert("Paper is not active");
        }
      }}
      className={isModal ? modules.paperModal : modules.paperItem}
    ></div>
  );
};

export default Paper;
