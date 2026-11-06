
import { describe, it, expect } from "vitest";
import { runAnomaly } from "../src/anomaly.js";

function calculate(expression: string): number {
  const result = runAnomaly(`show ${expression}`);
  return result.output[0];
}

describe("Anomaly arithmetic", () => {

  it("adds numbers", () => {
    expect(calculate("10 + 5")).toBe(15);
  });

  it("subtracts numbers", () => {
    expect(calculate("10 - 5")).toBe(5);
  });

  it("multiplies numbers", () => {
    expect(calculate("10 * 5")).toBe(50);
  });

  it("divides numbers", () => {
    expect(calculate("10 / 5")).toBe(2);
  });

  it("respects operator precedence", () => {
    expect(calculate("10 + 5 * 2")).toBe(20);
  });

  it("respects parentheses", () => {
    expect(calculate("(10 + 5) * 2")).toBe(30);
  });

  it("handles left associativity", () => {
    expect(calculate("20 - 5 - 3")).toBe(12);
    expect(calculate("100 / 10 / 2")).toBe(5);
  });

  it("handles negative values", () => {
    expect(calculate("-25")).toBe(-25);
    expect(calculate("10 + -5")).toBe(5);
    expect(calculate("-(10 + 5)")).toBe(-15);
  });

  it("supports nested expressions", () => {
    expect(calculate("((10 + 5) * 2) / 3")).toBe(10);
  });

  it("supports variable expressions", () => {
    const result = runAnomaly(`
      set price = 150
      set quantity = 4
      show price * quantity
    `);

    expect(result.output).toEqual([600]);
  });

  it("allows reassignment using previous value", () => {
    const result = runAnomaly(`
      set total = 10
      set total = total + 5
      show total
    `);

    expect(result.output).toEqual([15]);
  });

  it("rejects division by zero", () => {
    expect(() => calculate("10 / 0"))
      .toThrow("Division by zero.");
  });
});
