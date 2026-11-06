import { EmptyFileSystem } from "langium";
import { createAnomalyServices } from "./language/anomaly-module.js";
import { isModel } from "./generated/ast.js";
import { AnomalyInterpreter } from "./interpreter/anomaly-interpreter.js";

// Initialize Langium services
const services = createAnomalyServices(EmptyFileSystem);

export function runAnomaly(source: string) {

  // Parse the Anomaly source code
  const parsed = services.Anomaly.parser.LangiumParser.parse(source);

  // Check for lexer and parser errors
  if (
    parsed.lexerErrors.length > 0 ||
    parsed.parserErrors.length > 0
  ) {
    const errors = [
      ...parsed.lexerErrors.map(e => e.message),
      ...parsed.parserErrors.map(e => e.message)
    ];

    throw new Error(
      `Anomaly syntax error:\n${errors.join("\n")}`
    );
  }

  // Verify the AST is an Anomaly Model
  if (!isModel(parsed.value)) {
    throw new Error(
      "The parsed program is not a valid Anomaly Model."
    );
  }

  // Create the interpreter
  const interpreter = new AnomalyInterpreter();

  // Execute the program
  return interpreter.execute(parsed.value);
}
