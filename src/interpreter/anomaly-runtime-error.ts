import type { AstNode } from "langium";

export class AnomalyRuntimeError extends Error {
  constructor(message: string, node?: AstNode) {
    const position = node?.$cstNode?.range.start;

    const location = position
      ? `Line ${position.line + 1}, Column ${position.character + 1}`
      : "Unknown location";

    super(`${location}: ${message}`);

    this.name = "AnomalyRuntimeError";
  }
}
