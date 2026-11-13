(() => {
  const calculator = document.getElementById("calculator");
  if (!calculator) return;
  const display = document.getElementById("calculator-display");
  let expression = "";
  let resultShown = false;
  let hasError = false;

  const render = (value) => {
    display.textContent = value || "0";
  };
  const formatResult = (value) => {
    if (!Number.isFinite(value)) throw new Error("Result is outside the supported range.");
    return String(Number(value.toPrecision(10)));
  };
  const evaluate = (source) => {
    let position = 0;
    const skipSpaces = () => {
      while (/\s/.test(source[position] || "")) position += 1;
    };
    const parseNumber = () => {
      skipSpaces();
      const start = position;
      let decimals = 0;
      while (/[0-9.]/.test(source[position] || "")) {
        if (source[position] === ".") decimals += 1;
        position += 1;
      }
      const token = source.slice(start, position);
      if (!token || decimals > 1 || token === ".") throw new Error("Invalid number.");
      return Number(token);
    };
    const parseFactor = () => {
      skipSpaces();
      if (source[position] === "+" || source[position] === "-") {
        const sign = source[position] === "-" ? -1 : 1;
        position += 1;
        return sign * parseFactor();
      }
      if (source[position] === "(") {
        position += 1;
        const value = parseExpression();
        skipSpaces();
        if (source[position] !== ")") throw new Error("Unmatched parenthesis.");
        position += 1;
        return value;
      }
      return parseNumber();
    };
    const parseTerm = () => {
      let value = parseFactor();
      while (true) {
        skipSpaces();
        const operator = source[position];
        if (operator !== "*" && operator !== "/") break;
        position += 1;
        const right = parseFactor();
        if (operator === "/" && right === 0) throw new Error("Cannot divide by zero.");
        value = operator === "*" ? value * right : value / right;
      }
      return value;
    };
    const parseExpression = () => {
      let value = parseTerm();
      while (true) {
        skipSpaces();
        const operator = source[position];
        if (operator !== "+" && operator !== "-") break;
        position += 1;
        const right = parseTerm();
        value = operator === "+" ? value + right : value - right;
      }
      return value;
    };
    if (!source.trim()) throw new Error("Enter a calculation.");
    const value = parseExpression();
    skipSpaces();
    if (position !== source.length) throw new Error("Invalid expression.");
    return formatResult(value);
  };

  const appendDigit = (digit) => {
    if (hasError || resultShown) expression = "";
    hasError = false;
    resultShown = false;
    expression += digit;
    render(expression);
  };
  const appendOperator = (operator) => {
    if (hasError) {
      expression = "";
      hasError = false;
      render("0");
    }
    resultShown = false;
    if (!expression) {
      if (operator === "-") expression = "-";
      else return;
    } else if (/[+\-*/.]$/.test(expression)) {
      if (operator === "-" && /[*/]$/.test(expression)) expression += operator;
      else expression = expression.slice(0, -1) + operator;
    } else {
      expression += operator;
    }
    render(expression);
  };
  calculator.addEventListener("click", (event) => {
    const button = event.target.closest("[data-calc]");
    if (!button) return;
    const action = button.dataset.calc;
    if (action === "clear") {
      expression = "";
      resultShown = false;
      hasError = false;
      render("0");
    } else if (action === "digit") {
      appendDigit(button.dataset.value);
    } else if (action === "operator") {
      appendOperator(button.dataset.value);
    } else if (action === "decimal") {
      if (hasError || resultShown) expression = "";
      hasError = false;
      resultShown = false;
      const currentNumber = expression.split(/[+\-*/]/).pop();
      if (!currentNumber.includes(".")) {
        expression += currentNumber ? "." : "0.";
        render(expression);
      }
    } else if (action === "equals") {
      try {
        const result = evaluate(expression);
        expression = result;
        render(result);
        resultShown = true;
        hasError = false;
      } catch (error) {
        console.info("Calculator input was not a valid calculation:", error.message);
        render(error.message === "Cannot divide by zero." ? "Cannot divide by 0" : "Invalid input");
        expression = "";
        resultShown = true;
        hasError = true;
      }
    }
  });
})();
