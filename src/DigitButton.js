import { ACTIONS } from "./App"


/* It is a separate JavaScript file that exports a React functional component called DigitButton. 
This component is responsible for rendering a button representing a digit in a calculator application. 
It receives two props as input: */
export default function DigitButton({ dispatch, digit }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  )
}
