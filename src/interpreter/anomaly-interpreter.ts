import {
  type Model,
  type Expression,
  type Statement,
  isSetStatement,
  isShowStatement,
  isNumberLiteral,
  isBooleanLiteral,
  isVariableReference,
  isBinaryExpression,
  isUnaryExpression,
  isIfStatement,
  isLogicalNotExpression,
} from "../generated/ast.js";
import type { AstNode } from "langium";
import { AnomalyRuntimeError } from "./anomaly-runtime-error.js";

export type AnomalyValue = number | boolean | string | Date;

export interface ExecutionResult {
  variables: Record<string, AnomalyValue>;
  output: AnomalyValue[];
}

export class AnomalyInterpreter {
  private variables = new Map<string, AnomalyValue>();
  private output: AnomalyValue[] = [];

  execute(program: Model): ExecutionResult {
    this.variables.clear();
    this.output = [];

    // Execute the program's top-level statements.
    this.executeStatements(program.statements);

    return {
      variables: Object.fromEntries(this.variables),
      output: [...this.output],
    };
  }

  private executeStatements(statements: Statement[]): void {
    for (const statement of statements) {
      // ---------------------------------
      // Variable assignment
      // ---------------------------------
      if (isSetStatement(statement)) {
        const value = this.evaluate(statement.value);

        this.variables.set(statement.name, value);
        continue;
      }

      // ---------------------------------
      // Output
      // ---------------------------------
      if (isShowStatement(statement)) {
        const value = this.evaluate(statement.value);

        this.output.push(value);
        continue;
      }

      // ---------------------------------
      // Conditional statements
      // ---------------------------------
      if (isIfStatement(statement)) {
        // First, check the main condition.
        if (this.evaluateCondition(statement.condition)) {
          this.executeStatements(statement.thenStatements);
          continue;
        }

        // If the main condition is false,
        // check each else-if branch in order.
        let matched = false;

        for (const clause of statement.elseIfClauses) {
          if (this.evaluateCondition(clause.condition)) {
            this.executeStatements(clause.statements);
            matched = true;
            break;
          }
        }

        // Execute else only if nothing matched.
        if (!matched) {
          this.executeStatements(statement.elseStatements ?? []);
        }

        continue;
      }

      throw new AnomalyRuntimeError("Unsupported statement.", statement);
    }
  }

  private evaluate(expression: Expression): AnomalyValue {
    // ------------------------------------
    // Boolean literals
    // Example: true, false
    // ------------------------------------
    if (isBooleanLiteral(expression)) {
      return expression.value;
    }

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
      const operator = expression.operator;

      switch (operator) {
        case "-":
          return this.validateNumber(-value, expression);

        case "+":
          return this.validateNumber(+value, expression);

        default:
          const unhandledOperator: never = operator;
          throw new Error(`Unsupported operator: ${String(unhandledOperator)}`);
      }
    }

    // ------------------------------------
    // Binary expressions
    // Examples: 10 + 5, price * quantity
    // ------------------------------------
    if (isBinaryExpression(expression)) {
      const left = this.requireNumber(this.evaluate(expression.left));
      const right = this.requireNumber(this.evaluate(expression.right));
      const operator = expression.operator;

      switch (operator) {
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
          throw new AnomalyRuntimeError(
            "This expression does not produce a number.",
            expression,
          );
      }
    }

    throw new Error("Unsupported expression.");
  }

  private evaluateCondition(expression: Expression): boolean {
    if (isBooleanLiteral(expression) || isVariableReference(expression)) {
      const value = this.evaluate(expression);

      if (typeof value !== "boolean") {
        throw new AnomalyRuntimeError(
          "A condition must evaluate to true or false.",
          expression,
        );
      }

      return value;
    }

    if (isLogicalNotExpression(expression)) {
      return !this.evaluateCondition(expression.operand);
    }

    if (isBinaryExpression(expression) && expression.operator === "and") {
      return (
        this.evaluateCondition(expression.left) &&
        this.evaluateCondition(expression.right)
      );
    }

    if (isBinaryExpression(expression) && expression.operator === "or") {
      return (
        this.evaluateCondition(expression.left) ||
        this.evaluateCondition(expression.right)
      );
    }

    // For v0.1, conditions must be comparisons.
    if (!isBinaryExpression(expression)) {
      throw new AnomalyRuntimeError(
        "A condition must contain a comparison.",
        expression,
      );
    }

    const operator = expression.operator;

    switch (operator) {
      case "==":
      case "!=":
      case ">":
      case "<":
      case ">=":
      case "<=":
        break;

      default:
        throw new AnomalyRuntimeError(
          "Expected a comparison operator.",
          expression,
        );
    }

    // Evaluate both sides using our existing
    // numeric expression evaluator.
    const left = this.evaluate(expression.left);
    const right = this.evaluate(expression.right);

    switch (operator) {
      case "==":
        return left === right;

      case "!=":
        return left !== right;

      case ">":
        return left > right;

      case "<":
        return left < right;

      case ">=":
        return left >= right;

      case "<=":
        return left <= right;
    }
  }

  private validateNumber(value: number, node: AstNode): number {
    if (!Number.isFinite(value)) {
      throw new AnomalyRuntimeError(
        "Calculation produced an invalid number.",
        node,
      );
    }

    return value;
  }

  private requireNumber(value: AnomalyValue): number {
    if (typeof value !== "number") {
      throw new Error("This operation requires a number.");
    }

    return value;
  }
}
