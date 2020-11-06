import React from "react";
import "./input.css";

const input = (props) => {
  let lab = null
  if (props.label) {
  lab = <label>{props.label}</label>
  }
  return (
    <React.Fragment>
      <input
      className={props.class}
      type={props.type}
      value={props.val}
      placeholder={props.placeholder}
      onChange={props.changed}
    />
    {lab}
    </React.Fragment>
    
  );
};

export default input;
