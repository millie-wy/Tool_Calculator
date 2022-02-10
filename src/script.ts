window.addEventListener("keydown", handleKeyDown);
window.onload = () => {
  loadHeader();
  loadMain();
  loadFooter();
};

let previousOperand: string[] = [];
let currentOperand: string[] = ["0"];

function handleKeyDown(event: KeyboardEvent) {
  clearDisplay();

  const numberKeys: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  for (let i: number = 0; i < numberKeys.length; i++) {
    if (Number(currentOperand[0]) === 0 && Number(event.key) === 0) {
      // avoid multiple 0 input if the first digit input is 0
      currentOperand.shift();
    } else if (Number(currentOperand[0]) === 0 && Number(event.key) !== 0) {
      // remove the 0 if the first digit input is 0
      currentOperand.shift();
    }

    if (Number(event.key) === numberKeys[i]) {
      // push in number input to currentOperand
      currentOperand.push(event.key);
    }
  }

  const symbolKeys: string[] = ["+", "-", "*", "/", ".", "="];
  for (let x: number = 0; x < symbolKeys.length; x++) {
    if (currentOperand.length !== 0 && event.key === symbolKeys[x]) {
      // avoid symbol input before a digit is enter
      if (event.key === "*") {
        currentOperand.push(symbolKeys[x].replace(symbolKeys[x], "×")); // convert the multiply symbol
      } else if (event.key === "/") {
        currentOperand.push(symbolKeys[x].replace(symbolKeys[x], "÷")); // convert the divide symbol
      } else {
        currentOperand.push(symbolKeys[x]); // push in symbol key to currentOperand
      }
      previousOperand.push(currentOperand.join("").toString());
      currentOperand = ["0"];
    }
  }

  if (event.key === "%") {
    // convert % to muliply 0.01
    let toPercentage: string = (Number(currentOperand.join("")) * 0.01)
      .toFixed(2)
      .toString();
    currentOperand[0] = toPercentage;
  }

  if (event.keyCode === 8) {
    // backspace
    currentOperand.pop();
  } else if (event.keyCode === 27) {
    // escape
    previousOperand = [];
    currentOperand = ["0"];
  } else if (event.keyCode === 13 && previousOperand.length !== 0) {
    // enter
    let enter = event.key;
    enter = "=";
    performCalculation();
  }

  loadDisplay();
}

function handleBtnClick(event: Event) {
  clearDisplay();
  const eventTarget = event.target as HTMLButtonElement;
  eventTarget.blur(); // remove focus after click
  const userInput = eventTarget.innerText;

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
  ];
  for (let i: number = 0; i < numberKeys.length; i++) {
    if (Number(currentOperand[0]) === 0 && userInput === numberKeys[i]) {
      currentOperand.shift();
      currentOperand.push(userInput);
    } else if (userInput === numberKeys[i]) {
      currentOperand.push(userInput);
    }
  }

  const symbolKeys: string[] = ["+", "-", "×", "÷", ".", "="];
  for (let x: number = 0; x < symbolKeys.length; x++) {
    if (currentOperand.length !== 0 && userInput === symbolKeys[x]) {
      // avoid symbol input before a digit is enter
      currentOperand.push(userInput);
      previousOperand.push(currentOperand.join("").toString());
      currentOperand = ["0"];
    }
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
  prevInput.innerText = previousOperand.toString();
  if (prevInput.innerText.length > 20) {
    prevInput.innerText = prevInput.innerText.substring(
      prevInput.innerText.length,
      20
    );
  }

  const currInput: HTMLElement = document.createElement("p");
  screen?.appendChild(currInput);
  currInput.className = "currInput";
  currInput.innerText = currentOperand.join("").toString();
  if (currInput.innerText.length > 20) {
    currInput.innerText = currInput.innerText.substring(
      currInput.innerText.length,
      20
    );
  }
}

function clearDisplay() {
  const currInput: HTMLElement | null = document.querySelector(".currInput");
  currInput?.remove();

  const prevInput: HTMLElement | null = document.querySelector(".prevInput");
  prevInput?.remove();
}

function performCalculation() {
  let computation: number;
  let prev: number = parseFloat(previousOperand.join(""));
  let curr: number = parseFloat(currentOperand.join(""));

  if (previousOperand[0].includes("+")) {
    computation = prev + curr;
  } else if (previousOperand[0].includes("-")) {
    computation = prev - curr;
  } else if (previousOperand[0].includes("×")) {
    computation = prev * curr;
  } else if (previousOperand[0].includes("÷")) {
    computation = prev / curr;
  } else {
    return false;
  }
  printAnswer(computation);
}

function printAnswer(computation: number) {
  currentOperand = [];
  previousOperand = [];
  currentOperand.push(computation.toString());
}
