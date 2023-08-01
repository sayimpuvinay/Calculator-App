import React from "react";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

const PERCENTAGE = "%";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  PERCENTAGE: "percentage"
};

function reducer(state, { type, payload }) {
  switch (type) {


    case ACTIONS.ADD_DIGIT:
      /* This action is used when a user wants to add a digit to the number they are currently entering. 
      It checks certain conditions before updating the state */
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }


    case ACTIONS.CHOOSE_OPERATION:
      /* This action is used when a user selects an operation (like addition or subtraction). 
      The behavior depends on the current state */
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }


    case ACTIONS.CLEAR:
      /* This action clears the entire state, resetting the calculator-like application to its initial state. */
      return {}


    case ACTIONS.DELETE_DIGIT:
      /*  This action is used when a user wants to delete the last digit entered */
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }


    case ACTIONS.EVALUATE:
      /* This action is triggered when a user wants to calculate the result of the expression they entered. 
      It checks whether all the required data (operation, currentOperand, and previousOperand) are present */
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }

    case ACTIONS.PERCENTAGE:
        if (state.currentOperand == null) return state;
  
        const current = parseFloat(state.currentOperand);
        if (isNaN(current)) return state;
  
        const percentageValue = current / 100;
  
        return {
          ...state,
          currentOperand: percentageValue.toString(),
        };
    default:
    return state;
  }
}


/* This below code defines a function called evaluate, 
  which is responsible for performing arithmetic calculations based on the 
  currentOperand, previousOperand, and the operation. */
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    case "%":
      computation = (prev / 100) * current  // Perform the percentage calculation here
      break
    default:
      return ""
  }

  return computation.toString()
}


/* The code defines a constant variable called INTEGER_FORMATTER which uses the Intl.
NumberFormat constructor to create a number formatting object.

 if you use INTEGER_FORMATTER to format the number 1234.567, 
 it will produce the string "1,235" 
 (rounded to the nearest whole number and with a comma as the thousand separator according to the en-us locale). 
 If you pass 9876.123, it will produce "9,876".

*/
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

/* The code defines a function called formatOperand, 
which takes an operand as input and returns a formatted string representation of the number. */
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      {/* Output display */}
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      {/* Calculator buttons */}
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <OperationButton dispatch={dispatch} operation={PERCENTAGE} /> {/* Use DigitButton for Percentage */}
      <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>
    </div>
  );
}


export default App
