
import { describe, it, expect } from "vitest";
import { runAnomaly } from "../src/anomaly.js";

describe("Anomaly conditional statements", () => {
  it("executes a true if branch", () => {
    const result = runAnomaly(`
      set amount = 500
      if amount > 100
        show 1
      end
    `);

    expect(result.output).toEqual([1]);
  });

  it("skips a false if branch", () => {
    const result = runAnomaly(`
      if 10 > 100
        show 1
      end
      show 2
    `);

    expect(result.output).toEqual([2]);
  });

  it("executes else", () => {
    const result = runAnomaly(`
      if 10 > 100
        show 1
      else
        show 2
      end
    `);

    expect(result.output).toEqual([2]);
  });

  it("executes the first matching else-if", () => {
    const result = runAnomaly(`
      set amount = 50

      if amount > 100
        show 1
      else if amount > 25
        show 2
      else if amount > 10
        show 3
      else
        show 4
      end
    `);

    expect(result.output).toEqual([2]);
  });

  it("supports nested conditions", () => {
    const result = runAnomaly(`
      if 10 > 5
        if 20 > 10
          show 100
        end
      end
    `);

    expect(result.output).toEqual([100]);
  });

  it("does not execute skipped branches", () => {
    const result = runAnomaly(`
      if 1 > 2
        show missingVariable
      else
        show 5
      end
    `);

    expect(result.output).toEqual([5]);
  });

  it("evaluates arithmetic in conditions", () => {
    const result = runAnomaly(`
      if 10 * 5 >= 50
        show 1
      end
    `);

    expect(result.output).toEqual([1]);
  });
});

it("supports nested logical not operators", () => {
  const result = runAnomaly(`
    if not not 10 > 5
      show 1
    else
      show 0
    end
  `);

  expect(result.output).toEqual([1]);
});

it("supports logical and operators", () => {
  const result = runAnomaly(`
    if 10 > 5 and 20 > 10
      show 1
    else
      show 0
    end
  `);

  expect(result.output).toEqual([1]);
});

it("supports logical or operators", () => {
  const result = runAnomaly(`
    if 10 > 5 or 20 / 0 > 10
      show 1
    else
      show 0
    end
  `);

  expect(result.output).toEqual([1]);
});

it("supports boolean literals in conditions", () => {
  const result = runAnomaly(`
    set approved = true
    if approved
      show 1
    else
      show 0
    end
  `);

  expect(result.output).toEqual([1]);
});

it("supports negated boolean literals in conditions", () => {
  const result = runAnomaly(`
    set approved = false
    if not approved
      show 1
    else
      show 0
    end
  `);

  expect(result.output).toEqual([1]);
});

it("invalid arithmetic throws error", () => {
  expect(() =>
    runAnomaly(`
      set approved = true
      show approved + 10
    `),
  ).toThrow("This operation requires a number.");
});

it("rejects numeric conditions", () => {
  expect(() =>
    runAnomaly(`
      if 10
        show 1
      end
    `),
  ).toThrow("A condition must contain a comparison.");
});