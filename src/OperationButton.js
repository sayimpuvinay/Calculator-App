import { ACTIONS } from "./App"

/* It is another separate JS file that exports a React functional component called OperationButton. 
This component is responsible for rendering a button representing an operation 
(e.g., addition, subtraction, etc.) in a calculator-like application. 
It also receives two props as input: */

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  )
}
