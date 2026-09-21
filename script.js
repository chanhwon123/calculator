let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

const displayResult = document.getElementById('result');
const displayExpression = document.getElementById('expression');

// 디스플레이 업데이트
function updateDisplay() {
    displayResult.innerText = formatNumber(currentInput);
    
    if (operator !== null) {
        displayExpression.innerText = `${formatNumber(previousInput)} ${operator}`;
    } else {
        displayExpression.innerText = '';
    }
}

// 천 단위 콤마 추가 및 큰 수 포맷팅
function formatNumber(numStr) {
    if (numStr === 'Error' || numStr === 'Infinity') return numStr;
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

// 숫자 입력
function appendNumber(number) {
    if (currentInput === '0' || shouldResetDisplay) {
        if (number === '.') {
            currentInput = '0.';
        } else {
            currentInput = number;
        }
        shouldResetDisplay = false;
    } else {
        if (number === '.' && currentInput.includes('.')) return;
        if (currentInput.length >= 12) return; // 최대 길이 제한
        currentInput += number;
    }
    updateDisplay();
}

// 연산자 선택
function appendOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

// 전체 초기화 (AC)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// 한 글자 삭제 (DEL)
function deleteLast() {
    if (shouldResetDisplay) return;
    if (currentInput.length === 1 || currentInput === 'Error') {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// 계산 실행 (=)
function calculate() {
    if (operator === null || shouldResetDisplay) return;

    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result = 0;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                currentInput = 'Error';
                operator = null;
                previousInput = '';
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // 소수점 정밀도 처리 (부동소수점 오차 방지)
    result = Math.round(result * 100000000) / 100000000;

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// 키보드 지원
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') appendNumber(key);
    if (key === '.') appendNumber('.');
    if (key === '+') appendOperator('+');
    if (key === '-') appendOperator('-');
    if (key === '*') appendOperator('×');
    if (key === '/') {
        event.preventDefault();
        appendOperator('÷');
    }
    if (key === '%') appendOperator('%');
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    if (key === 'Backspace') deleteLast();
    if (key === 'Escape') clearAll();
});