
import { runAnomaly } from "./anomaly.js";

const code = `
    set price = 150
    set quantity = 4
    set taxRate = 0.08

    set subtotal = price * quantity
    set tax = subtotal * taxRate
    set total = subtotal + tax

    show subtotal
    show tax
    show total

    set test = (10 + 5) * 2
    show test

    set negative = -25
    show negative

    set modulo = 10 % 3
    show modulo

    set power = 2 ^ 3 ^ 2
    show power

    set balance = 1250
    set overdueDays = 45

    if not balance > 1000
        show 1
    else if balance > 1000
        show 2
    else if balance > 0
        show 3
    else
        show 4
    end

    if 1==2 or balance > 1000 and not overdueDays > 30
        show 1
    else if 1==1 or balance < 0
        show 2
    else
        show 3
    end

    if overdueDays > 30
        if balance > 0
            show balance
        end
    end

    set balance = 0

    if balance == 0 or 100 / balance > 5
        show 1
    else
        show 2
    end

    show 99
`;


const codeTest = `
    set approved = true
    if approved
        show 1
    else
        show 2
    end
`;


try {
  //const result = runAnomaly(code);
  const result = runAnomaly(codeTest);

  console.log("Variables:", result.variables);
  console.log("Output:", result.output);

} catch (error) {
  console.error(error);
}
