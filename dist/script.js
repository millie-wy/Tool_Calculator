"use strict";
window.addEventListener('keydown', handleKeyDown);
window.onload = () => {
    loadHeader();
    loadMain();
    loadFooter();
};
let previousOperand = [];
let currentOperand = [];
function handleKeyDown(event) {
    clearDisplay();
    const numberKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    for (let i = 0; i < numberKeys.length; i++) {
        if (Number(currentOperand[0]) === 0 && Number(event.key) === 0) {
            currentOperand.shift();
        }
        else if (Number(currentOperand[0]) === 0 && Number(event.key) !== 0) {
            currentOperand.shift();
        }
        if (Number(event.key) === numberKeys[i]) {
            currentOperand.push(event.key);
        }
    }
    const symbolKeys = ['+', '-', '*', '/', '.', '='];
    for (let x = 0; x < symbolKeys.length; x++) {
        if (currentOperand.length !== 0 && event.key === symbolKeys[x]) {
            if (event.key === "*") {
                currentOperand.push(symbolKeys[x].replace(symbolKeys[x], '×'));
            }
            else if (event.key === "/") {
                currentOperand.push(symbolKeys[x].replace(symbolKeys[x], '÷'));
            }
            else {
                currentOperand.push(symbolKeys[x]);
            }
            previousOperand.push(currentOperand.join("").toString());
            currentOperand = [];
        }
    }
    if (event.key === "%") {
        let toPercentage = (Number(currentOperand.join("")) * 0.01);
        currentOperand[0] = toPercentage.toString();
    }
    if (event.keyCode === 8) { // BACKSPACE
        currentOperand.pop();
    }
    else if (event.keyCode === 27) { // ESCAPE
        previousOperand = [];
        currentOperand = [];
    }
    else if (event.keyCode === 13 && previousOperand.length !== 0) { // ENTER
        let enter = event.key;
        enter = '=';
        performCalculation();
    }
    loadDisplay();
}
function handleBtnClick(event) {
    clearDisplay();
    const eventTarget = event.target;
    eventTarget.blur(); // remove focus after click
    const userInput = eventTarget.innerText;
    const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for (let i = 0; i < numberKeys.length; i++) {
        if (userInput === numberKeys[i]) {
            currentOperand.push(userInput);
            console.log(currentOperand);
        }
    }
    loadDisplay();
}
function loadHeader() {
    const header = document.createElement('header');
    document.body.appendChild(header);
    const h1 = document.createElement('h1');
    h1.textContent = "Hello World Calculator";
    header.appendChild(h1);
    const p = document.createElement('p');
    p.textContent = "In this page all you see is a calculator I created for myself :D";
    header.appendChild(p);
}
function loadMain() {
    const main = document.createElement('main');
    document.body.appendChild(main);
    loadCalculator(main);
}
function loadFooter() {
    const calculatorDiv = document.querySelector('.calculator');
    const pName = document.createElement('p');
    calculatorDiv === null || calculatorDiv === void 0 ? void 0 : calculatorDiv.appendChild(pName);
    pName.className = 'myName';
    pName.innerHTML = 'MILLIE CHEUNG &#169 2022';
    const pLogo = document.createElement('p');
    calculatorDiv === null || calculatorDiv === void 0 ? void 0 : calculatorDiv.appendChild(pLogo);
    pLogo.className = 'myLogo';
    pLogo.innerHTML = '<a target="_blank" href="https://github.com/millie-wy"><i class="fab fa-github"></i></a>';
}
function loadCalculator(main) {
    const calculatorDiv = document.createElement('div');
    main.appendChild(calculatorDiv);
    calculatorDiv.className = "calculator";
    const calculatorScreen = document.createElement('div');
    calculatorDiv.appendChild(calculatorScreen);
    calculatorScreen.className = 'screen';
    loadDisplay();
    const calculatorButtons = document.createElement('div');
    calculatorDiv.appendChild(calculatorButtons);
    calculatorButtons.className = 'buttons';
    const buttons = [
        { btnName: 'bC', text: 'C' },
        { btnName: 'bPercent', text: '%' },
        { btnName: 'bDivision', text: '÷' },
        { btnName: 'bTimes', text: '×' },
        { btnName: 'b7', text: '7' },
        { btnName: 'b8', text: '8' },
        { btnName: 'b9', text: '9' },
        { btnName: 'bMinus', text: '-' },
        { btnName: 'b4', text: '4' },
        { btnName: 'b5', text: '5' },
        { btnName: 'b6', text: '6' },
        { btnName: 'bPlus', text: '+' },
        { btnName: 'b1', text: '1' },
        { btnName: 'b2', text: '2' },
        { btnName: 'b3', text: '3' },
        { btnName: 'bDot', text: '.' },
        { btnName: 'b0', text: '0' },
        { btnName: 'b00', text: '00' },
        { btnName: 'bEqual', text: '=' }
    ];
    for (let i = 0; i < buttons.length; i++) {
        let button = document.createElement('button');
        calculatorButtons.appendChild(button);
        button.innerText = buttons[i].text;
        button.className = buttons[i].btnName;
        button.addEventListener('click', handleBtnClick);
    }
    ;
}
function loadDisplay() {
    const screen = document.querySelector('.screen');
    const prevInput = document.createElement('p');
    prevInput.className = 'prevInput';
    prevInput.innerText = previousOperand.toString();
    screen === null || screen === void 0 ? void 0 : screen.appendChild(prevInput);
    if (prevInput.innerText.length > 20) {
        prevInput.innerText = prevInput.innerText.substring(prevInput.innerText.length, 20);
    }
    ;
    const currInput = document.createElement('p');
    currInput.className = 'currInput';
    currInput.innerText = currentOperand.join("").toString();
    screen === null || screen === void 0 ? void 0 : screen.appendChild(currInput);
    if (currInput.innerText.length > 20) {
        currInput.innerText = currInput.innerText.substring(currInput.innerText.length, 20);
    }
    ;
}
function clearDisplay() {
    const currInput = document.querySelector('.currInput');
    currInput === null || currInput === void 0 ? void 0 : currInput.remove();
    const prevInput = document.querySelector('.prevInput');
    prevInput === null || prevInput === void 0 ? void 0 : prevInput.remove();
}
function performCalculation() {
    let computation;
    let prev = parseFloat(previousOperand.join(""));
    let curr = parseFloat(currentOperand.join(""));
    if (previousOperand[0].includes('+')) {
        computation = prev + curr;
    }
    else if (previousOperand[0].includes('-')) {
        computation = prev - curr;
    }
    else if (previousOperand[0].includes('×')) {
        computation = prev * curr;
    }
    else if (previousOperand[0].includes('÷')) {
        computation = prev / curr;
    }
    else {
        return false;
    }
    printAnswer(computation);
}
function printAnswer(computation) {
    currentOperand = [];
    previousOperand = [];
    currentOperand.push(computation.toString());
}
//# sourceMappingURL=script.js.map