import React from "react";
import ReactDOM from "react-dom";
import modules from "./Modal.module.css";
import Rock from "../Rock/Rock";
import Paper from "../Paper/Paper";
import Scissors from "../Scissors/Scissors";
//scissors === 0
//paper === 1
// rock === 2
const elements = [
  <Scissors isModal={true} />,
  <Paper isModal={true} />,
  <Rock isModal={true} />,
];

const Modal = ({ onClose, player, opp }) => {
  const closeBtnHandler = () => {
    onClose();
  };
  return ReactDOM.createPortal(
    <div>
      <div className={modules.modal_background}></div>
      <div className={modules.modal_container}>
        {elements[player]}
        {elements[opp]}
        <button onClick={closeBtnHandler} className={modules.modalBtn}>
          Close
        </button>
      </div>
    </div>,
    document.querySelector(".modal")
  );
};

export default Modal;
