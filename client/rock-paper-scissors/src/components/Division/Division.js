import React, { useContext } from "react";
import modules from "./Division.module.css";
import { GameContext } from "../context/GameProvider";

const Division = (props) => {
  //const { resetCount } = useContext(GameContext);
  return <div className={modules.line}></div>;
};

export default Division;
