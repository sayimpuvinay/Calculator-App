import React from "react";

const Button = ({ text, dispatch }) => {
  return (
    <button onClick={() => dispatch({ type: text })}>
      {text}
    </button>
  );
};

export default Button;
