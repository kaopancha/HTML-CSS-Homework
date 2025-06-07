// script.js

const display = document.getElementById('main');
const history = document.getElementById('history');
const buttons = document.querySelectorAll('button');
const operatorList = ['+', '-', 'x', '÷'];

let currentInput = '';
let operator = '';
let firstOperand = '';
let secondOperand = '';
let historyText = '';
let isEqual = false;
let isChangeOperator = false;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('click : ' + button.textContent);
    handleInput(button.textContent);
  });
});

function handleInput(value) {
  let err = 0;
  // ตัวเลข กับ .
  if (!isNaN(value) || (value === '.' && !currentInput.includes('.'))) {
    if (currentInput.replace('.', '').length < 14)
      currentInput += value;
    isChangeOperator = false;

    if (firstOperand != '' && operator != '')
      historyText = historyText = firstOperand + ' ' + operator;

    display.textContent = formatNumber(currentInput, err);
    console.log(firstOperand, secondOperand, operator, isChangeOperator, isEqual);
  }
  // ลบข้อมูล
  else if (value === '⌫' && !isChangeOperator && !isEqual) {
    currentInput = currentInput.slice(0, -1);
    if(!currentInput || currentInput === '-')
      currentInput = '';

    display.textContent = formatNumber(currentInput, err);
  }
  // ลบข้อมูล
  else if (value === 'Clear') {
    currentInput = '';
    operator = '';
    firstOperand = '';
    secondOperand = '';
    historyText = '';
    isEqual = false;
    isChangeOperator = false;

    display.textContent = formatNumber(currentInput, err);
  }
  // ค่าลบ ค่าบวก
  else if (value === '+/-') {
    if (secondOperand != '' && currentInput != '' && currentInput != secondOperand){
      currentInput = (parseFloat(currentInput) * -1).toString();
      display.textContent = formatNumber(currentInput.toString(), err);
    }
    else if (secondOperand != '' && currentInput == ''){
      currentInput = (parseFloat(secondOperand) * -1).toString();
      display.textContent = formatNumber(currentInput.toString(), err);
    }
    else if (currentInput != '' && !isNaN(parseFloat(currentInput))){
      currentInput = (parseFloat(currentInput) * -1).toString();
      display.textContent = formatNumber(currentInput.toString(), err);
    }
    console.log(firstOperand, secondOperand, currentInput, operator, isChangeOperator, isEqual);
  }
  // operator
  else if (operatorList.includes(value)) {
    if (currentInput != ''){
      if (firstOperand != ''){
        secondOperand = currentInput;
        firstOperand = calculate();
      }
      else {
        firstOperand = currentInput;
        secondOperand = currentInput;
      }
    }
    else if (firstOperand == '') {
        firstOperand = '0';
    }
    else if (firstOperand != ''){
      secondOperand = firstOperand;
    }

    historyText = firstOperand + ' ' + value;
    operator = value;
    currentInput = '';
    isChangeOperator = true;

    display.textContent = formatNumber(firstOperand.toString(), err);
  }
  // เท่ากับ 
  else if (value === '=') {
    if (currentInput != '' && firstOperand != ''){
      secondOperand = currentInput;
    }
    else if (firstOperand == ''){
      firstOperand = currentInput;
    }
    else if (secondOperand == '') {
      secondOperand = '0';
    }

    let result = calculate();
    console.log(result);
    
    if (isNaN(parseFloat(result))){
      err++;
    }
    if (operator == ''){
      historyText = firstOperand + ' ='
    }
    else {
      historyText = firstOperand + ' ' + operator + ' ' + secondOperand + ' =';
    }
    firstOperand = result;
    currentInput = '';
    isEqual = true;

    // isCal = false;
    display.textContent = formatNumber(result.toString(), err);
  }

  history.textContent = historyText;
}

document.addEventListener('keydown', (e) => {
  const key = e.key;

  // ป้องกัน Enter ซ้ำ (สำคัญ!)
  if (key === 'Enter') {
    e.preventDefault();
  }

  // แปลงบาง key ให้ตรงกับปุ่มบน UI
  const map = {
    '*': 'x',
    '/': '÷',
    '-': '-',
    '+': '+',
    'Enter': '=',
    'Backspace': '⌫'
  };

  const normalizedKey = map[key] || key;
  console.log('keyboard : ' + normalizedKey);
  handleInput(normalizedKey);
});

function calculate()
{
  let result = 0;
  let a = parseFloat(firstOperand);
  let b = parseFloat(secondOperand);

  a = isNaN(a) ? 0 : a;
  b = isNaN(b) ? 0 : b;

  console.log('a :' + a, 'b :' + b, 'op :' + operator);
  

  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case 'x': result = a * b; break;
    case '÷': result = b !== 0 ? a / b : 'Cannot divide by 0'; break;
    default : result = a; break;
  }
  return result;
}

function formatNumber(str, err) {
  // เช็ค str
  let num = parseFloat(str);
  if (err != 0){
    return str;
  }
  else if (isNaN(num) && str[str.length - 1] === '.')
    return '0.';
  else if (isNaN(num))
    return '0';

  // format
  const hasDecimal = str.includes('.');
  var returnStr = num.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimal ? str.split('.')[1].length : 0,
    maximumFractionDigits: 20, // รองรับยาว ๆ
  })
  
  if(str[str.length - 1] === '.')
    return returnStr + '.';
  else
    return returnStr;
}

