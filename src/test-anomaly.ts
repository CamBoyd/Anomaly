
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
`;

try {
  const result = runAnomaly(code);

  console.log("Variables:", result.variables);
  console.log("Output:", result.output);

} catch (error) {
  console.error(error);
}
