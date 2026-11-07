import {
  type Model,
  type Expression,
  isSetStatement,
  isShowStatement,
  isNumberLiteral,
  isVariableReference,
  isBinaryExpression,
  isUnaryExpression,
} from "../generated/ast.js";
import type { AstNode } from "langium";
import { AnomalyRuntimeError } from "./anomaly-runtime-error.js";

export interface ExecutionResult {
  variables: Record<string, number>;
  output: number[];
}

export class AnomalyInterpreter {
  private variables = new Map<string, number>();
  private output: number[] = [];

  execute(program: Model): ExecutionResult {
    // Reset the state for each execution
    this.variables.clear();
    this.output = [];

    for (const statement of program.statements) {
      // Handle variable assignments
      if (isSetStatement(statement)) {
        const value = this.evaluate(statement.value);

        this.variables.set(statement.name, value);
      }

      // Handle show statements
      else if (isShowStatement(statement)) {
        const value = this.evaluate(statement.value);

        this.output.push(value);
      }
    }

    return {
      variables: Object.fromEntries(this.variables),
      output: [...this.output],
    };
  }

  private evaluate(expression: Expression): number {
    // ------------------------------------
    // Numeric literals
    // Example: 150
    // ------------------------------------
    if (isNumberLiteral(expression)) {
      return this.validateNumber(Number(expression.value), expression);
    }

    // ------------------------------------
    // Variable references
    // Example: price
    // ------------------------------------
    if (isVariableReference(expression)) {
      const value = this.variables.get(expression.name);

      if (value === undefined) {
        throw new Error(`Variable "${expression.name}" is not defined.`);
      }

      return value;
    }

    // ------------------------------------
    // Unary expressions
    // Examples: -10, +5, -(10 + 5)
    // ------------------------------------

    if (isUnaryExpression(expression)) {
      const value = this.evaluate(expression.operand);

      switch (expression.operator) {
        case "-":
          return this.validateNumber(-value, expression);

        case "+":
          return this.validateNumber(+value, expression);

        default:
          throw new Error(`Unknown unary operator: ${expression.operator}`);
      }
    }

    // ------------------------------------
    // Binary expressions
    // Examples: 10 + 5, price * quantity
    // ------------------------------------

    if (isBinaryExpression(expression)) {
      const left = this.evaluate(expression.left);
      const right = this.evaluate(expression.right);

      switch (expression.operator) {
        case "+":
          return this.validateNumber(left + right, expression);

        case "-":
          return this.validateNumber(left - right, expression);

        case "*":
          return this.validateNumber(left * right, expression);

        case "/":
          if (right === 0) {
            throw new AnomalyRuntimeError("Division by zero.", expression);
          }

          return this.validateNumber(left / right, expression);

        case "%":
          if (right === 0) {
            throw new AnomalyRuntimeError("Modulo by zero.", expression);
          }

          return this.validateNumber(left % right, expression);

        case "^":
          return this.validateNumber(left ** right, expression);

        default:
          throw new AnomalyRuntimeError(`Unknown binary operator: ${expression.operator}`, expression);
      }
    }

    throw new Error("Unsupported expression.");
  }

  private validateNumber(value: number, node: AstNode): number {
    if (!Number.isFinite(value)) {
      throw new AnomalyRuntimeError("Calculation produced an invalid number.", node);
    }

    return value;
  }
}
