window.addEventListener("keydown", handleKeyDown);
window.onload = () => {
  loadHeader();
  loadMain();
  loadFooter();
};

let prevOperand: string[] = [];
let currOperand: string[] = ["0"];

// push in number input to currentOperand
function addNumToCurrOperand(digit: string) {
  currOperand.push(digit);
}

function resetCurrOperand() {
  currOperand = ["0"];
}

function resetPrevOperand() {
  prevOperand = [];
}

function handleKeyDown(event: KeyboardEvent) {
  clearDisplay();

  const digits: string[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    ".",
  ];
  for (let i: number = 0; i < digits.length; i++) {
    if (
      (currOperand.length === 1 &&
        currOperand[0] === "0" &&
        event.key === "0") || // avoid multiple 0 input if the first digit input is 0
      (currOperand.length === 1 &&
        currOperand[0] === "0" &&
        event.key !== digits[i]) // avoid 0 being erased when other key is pressed
    ) {
      resetCurrOperand();
    } else if (
      currOperand.length === 1 &&
      currOperand[0] === "0" &&
      event.key === digits[i]
    ) {
      if (event.key === ".") {
        // not removing the initial 0
        addNumToCurrOperand(event.key);
      } else {
        // remove the initial 0
        currOperand.shift();
        addNumToCurrOperand(event.key);
      }
    } else if (event.key === digits[i]) {
      addNumToCurrOperand(event.key);
    }
  }

  const operators: string[] = ["+", "-", "*", "/"];
  for (let x: number = 0; x < operators.length; x++) {
    if (prevOperand.length !== 0 && event.key === operators[x]) {
      performCalculation();
    } else if (currOperand.length !== 0 && event.key === operators[x]) {
      // avoid symbol input before a digit is enter
      if (event.key === "*") {
        addNumToCurrOperand(operators[x].replace(operators[x], "×")); // convert the multiply symbol
      } else if (event.key === "/") {
        addNumToCurrOperand(operators[x].replace(operators[x], "÷")); // convert the divide symbol
      } else {
        addNumToCurrOperand(operators[x]); // push in symbol key to currentOperand
      }
      prevOperand.push(currOperand.join("").toString());
      resetCurrOperand();
    }
  }

  if (event.key === "%") {
    let num = Number(currOperand.join(""));
    currOperand = [];
    currOperand[0] = performPercentageCalculation(num).toString();
  }

  if (event.keyCode === 8) {
    // backspace
    removeLastDigitInput();
  } else if (event.keyCode === 27) {
    // escape
    resetCurrOperand();
    resetPrevOperand();
  } else if (
    (event.keyCode === 13 && prevOperand.length !== 0) ||
    (event.key === "=" && prevOperand.length !== 0)
  ) {
    // enter
    event.key.replace(event.key, "=");
    performCalculation();
  }

  loadDisplay();
}

function removeLastDigitInput() {
  currOperand.pop();
}

function checkIfInputIsNum(input: string) {
  const numberKeys: string[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "00",
    ".",
  ];
  for (let i: number = 0; i < numberKeys.length; i++) {
    if (input === numberKeys[i]) {
      return true;
    }
  }
  return false;
}

function handleBtnClick(event: Event) {
  clearDisplay();
  const eventTarget = event.target as HTMLButtonElement;
  eventTarget.blur(); // remove focus after click
  const userInput = eventTarget.innerText;

  if (
    // avoid input of "00" when currOperand is 0
    currOperand[0] === "0" &&
    userInput === "00"
  ) {
    resetCurrOperand();
  } else if (
    // normal input (currOperand is 0 and a digit is input)
    currOperand.length === 1 &&
    currOperand[0] === "0" &&
    checkIfInputIsNum(userInput)
  ) {
    if (userInput === ".") {
      // not removing the initial 0
      addNumToCurrOperand(userInput);
    } else {
      // remove the initial 0
      currOperand.shift();
      addNumToCurrOperand(userInput);
    }
  } else if (checkIfInputIsNum(userInput)) {
    addNumToCurrOperand(userInput);
  }

  const operators: string[] = ["+", "-", "×", "÷"];
  for (let x: number = 0; x < operators.length; x++) {
    if (
      // allow changing of operator of prevOpperand when curr is 0
      prevOperand.length !== 0 &&
      currOperand.length === 1 &&
      currOperand[0] === "0" &&
      userInput === operators[x]
    ) {
      let newPrev = [];
      newPrev[0] = prevOperand[0].slice(0, -1);
      newPrev.push(userInput);
      resetPrevOperand();
      prevOperand.push(newPrev.join("").toString());
    } else if (prevOperand.length !== 0 && userInput === operators[x]) {
      // perform calculation if prevOperand is not empty
      performCalculation();
    } else if (
      // avoid symbol input when the currOperand is 0
      currOperand.length === 1 &&
      currOperand[0] === "0" &&
      userInput === operators[x]
    ) {
      resetCurrOperand();
      console.log("reset!");
    } else if (currOperand.length !== 0 && userInput === operators[x]) {
      // allow input when currOperand is not empty
      currOperand.push(userInput);
      prevOperand.push(currOperand.join("").toString());
      resetCurrOperand();
    }
  }

  if (userInput === "%") {
    let num = Number(currOperand.join(""));
    currOperand = [];
    currOperand[0] = performPercentageCalculation(num).toString();
  } else if (userInput === "C") {
    resetCurrOperand();
    resetPrevOperand();
  } else if (userInput === "=" && prevOperand.length !== 0) {
    performCalculation();
  }

  loadDisplay();
}

function loadHeader() {
  const header: HTMLElement = document.createElement("header");
  document.body.appendChild(header);

  const h1: HTMLElement = document.createElement("h1");
  h1.textContent = "Hello World Calculator";
  header.appendChild(h1);

  const p: HTMLElement = document.createElement("p");
  p.textContent =
    "In this page all you see is a calculator I created for myself :D";
  header.appendChild(p);
}

function loadMain() {
  const main: HTMLElement = document.createElement("main");
  document.body.appendChild(main);
  loadCalculator(main);
}

function loadFooter() {
  const calculatorDiv = document.querySelector(".calculator");
  const pName: HTMLElement = document.createElement("p");
  calculatorDiv?.appendChild(pName);
  pName.className = "myName";
  pName.innerHTML = "MILLIE CHEUNG &#169 2022";

  const pLogo: HTMLElement = document.createElement("p");
  calculatorDiv?.appendChild(pLogo);
  pLogo.className = "myLogo";
  pLogo.innerHTML =
    '<a target="_blank" href="https://github.com/millie-wy"><i class="fab fa-github"></i></a>';
}

function loadCalculator(main: HTMLElement) {
  const calculatorDiv: HTMLElement = document.createElement("div");
  main.appendChild(calculatorDiv);
  calculatorDiv.className = "calculator";

  const calculatorScreen: HTMLElement = document.createElement("div");
  calculatorDiv.appendChild(calculatorScreen);
  calculatorScreen.className = "screen";
  loadDisplay();

  const calculatorButtons: HTMLElement = document.createElement("div");
  calculatorDiv.appendChild(calculatorButtons);
  calculatorButtons.className = "buttons";

  const buttons: { btnName: string; text: string }[] = [
    { btnName: "bC", text: "C" },
    { btnName: "bPercent", text: "%" },
    { btnName: "bDivision", text: "÷" },
    { btnName: "bTimes", text: "×" },
    { btnName: "b7", text: "7" },
    { btnName: "b8", text: "8" },
    { btnName: "b9", text: "9" },
    { btnName: "bMinus", text: "-" },
    { btnName: "b4", text: "4" },
    { btnName: "b5", text: "5" },
    { btnName: "b6", text: "6" },
    { btnName: "bPlus", text: "+" },
    { btnName: "b1", text: "1" },
    { btnName: "b2", text: "2" },
    { btnName: "b3", text: "3" },
    { btnName: "bDot", text: "." },
    { btnName: "b0", text: "0" },
    { btnName: "b00", text: "00" },
    { btnName: "bEqual", text: "=" },
  ];

  for (let i: number = 0; i < buttons.length; i++) {
    let button: HTMLElement = document.createElement("button");
    calculatorButtons.appendChild(button);
    button.innerText = buttons[i].text;
    button.className = buttons[i].btnName;
    button.addEventListener("click", handleBtnClick);
  }
}

function loadDisplay() {
  const screen = document.querySelector(".screen");

  const prevInput: HTMLElement = document.createElement("p");
  screen?.appendChild(prevInput);
  prevInput.className = "prevInput";
  prevInput.innerText = prevOperand.toString();
  if (prevInput.innerText.length > 16) {
    prevInput.innerText = prevInput.innerText.substring(0, 18);
  }

  const currInput: HTMLElement = document.createElement("p");
  screen?.appendChild(currInput);
  currInput.className = "currInput";
  currInput.innerText = currOperand.join("").toString();
  if (currInput.innerText.length > 16) {
    currInput.innerText = currInput.innerText.substring(0, 16);
  }
}

function clearDisplay() {
  const currInput: HTMLElement | null = document.querySelector(".currInput");
  currInput?.remove();

  const prevInput: HTMLElement | null = document.querySelector(".prevInput");
  prevInput?.remove();
}

function performPercentageCalculation(num: number) {
  return (num / 100).toFixed(2);
}

function performCalculation() {
  let computation: number;
  let prev: number = parseFloat(prevOperand.join(""));
  let curr: number = parseFloat(currOperand.join(""));
  if (prevOperand[0].includes("+")) {
    computation = prev + curr;
  } else if (prevOperand[0].includes("-")) {
    computation = prev - curr;
  } else if (prevOperand[0].includes("×")) {
    computation = prev * curr;
  } else if (prevOperand[0].includes("÷")) {
    computation = prev / curr;
  } else {
    return false;
  }
  printAnswer(computation);
}

function printAnswer(computation: number) {
  currOperand = [];
  resetPrevOperand();
  addNumToCurrOperand(computation.toString());
}
