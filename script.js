const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let previousInput = null;
let operator = null;
let resetOnNextDigit = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function enterNumber(number) {
  if (resetOnNextDigit) {
    currentInput = number === "." ? "0." : number;
    resetOnNextDigit = false;
  } else if (number === "." && currentInput.includes(".")) {
    return;
  } else if (currentInput === "0" && number !== ".") {
    currentInput = number;
  } else {
    currentInput += number;
  }

  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (operator && !resetOnNextDigit) {
    calculate();
  }

  previousInput = currentInput;
  operator = nextOperator;
  resetOnNextDigit = true;
}

function calculate() {
  if (operator === null || previousInput === null) return;

  const left = Number(previousInput);
  const right = Number(currentInput);
  let result;

  switch (operator) {
    case "+":
      result = left + right;
      break;
    case "-":
      result = left - right;
      break;
    case "*":
      result = left * right;
      break;
    case "/":
      if (right === 0) {
        currentInput = "Cannot divide by zero";
        previousInput = null;
        operator = null;
        resetOnNextDigit = true;
        updateDisplay();
        return;
      }
      result = left / right;
      break;
    default:
      return;
  }

  currentInput = String(Number(result.toFixed(10)));
  previousInput = null;
  operator = null;
  resetOnNextDigit = true;
  updateDisplay();
}

function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  resetOnNextDigit = false;
  updateDisplay();
}

function deleteDigit() {
  if (resetOnNextDigit || currentInput.length <= 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  resetOnNextDigit = false;
  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "calculate") {
    calculate();
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  } else if (button.dataset.action === "delete") {
    deleteDigit();
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) {
    enterNumber(event.key);
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteDigit();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});