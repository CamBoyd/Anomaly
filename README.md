# Workspace overview

Depending on the selection during the project generation you will have one or more packages contained in the packages directory.
Please check the specific projects here:

- [packages/language](./packages/language/README.md) This package is always available and contains the language definition.
- [packages/cli](./packages/cli/README.md) *Optional* Is only available if you chose to use the command-line interface.
- [packages/extension](./packages/extension/langium-quickstart.md) *Optional* Contains the VSCode extension if you chose to create it.

## What's in the folder?

Some file are contained in the root directory as well.

- [package.json](./package.json) - The manifest file the main workspace package
- [tsconfig.json](./tsconfig.json) - The base TypeScript compiler configuration
- [tsconfig.build.json](./tsconfig.build.json) - Configuration used to build the complete source code.
- [.gitignore](.gitignore) - Files ignored by git


# Anomaly

**Anomaly is a readable, data-oriented programming language designed for spreadsheets, datasets, and web applications.**

Anomaly allows users to write programs using simple, human-readable commands. It is designed for both nonprogrammers and experienced developers.

Anomaly is implemented in TypeScript and is intended to execute at runtime through a dedicated interpreter.

## Design Principles

1. **Readability First** — Code should be understandable without extensive programming experience.
2. **Simplicity** — Avoid unnecessary punctuation and complicated syntax.
3. **Data-Oriented** — Make it easy to query, transform, calculate, and validate datasets.
4. **Visual Programming** — Support program creation through an in-app builder.
5. **Extensibility** — Allow additional functions, data types, and capabilities to be introduced over time.
6. **Portability** — Work in browsers, Node.js, and modern web applications.
7. **Safety** — Execute programs within a controlled runtime without arbitrary access to application internals.

## Example Syntax

The following examples describe the intended language, including features that are not yet implemented.

### Variables

```anomaly
set price = 150
set quantity = 4
set total = price * quantity

show total
```

### Conditions

```anomaly
if total > 500
    show "Large transaction"
else
    show "Small transaction"
end
```

### Loops

```anomaly
for each invoice in Invoices
    show invoice.Amount
end
```

### Functions

```anomaly
function calculateTax(amount, rate)
    return amount * rate
end

set tax = calculateTax(500, 0.08)
```

### Dataset Operations

```anomaly
set overdue = Invoices where Balance > 0

show sum(overdue.Balance)
```

## Architecture

Anomaly consists of several components:

- **Grammar:** Defines the language syntax.
- **Parser:** Converts source code into an Abstract Syntax Tree (AST).
- **Validator:** Detects invalid statements and expressions.
- **Interpreter:** Executes programs represented by the AST.
- **Runtime:** Manages variables, functions, and execution limits.
- **Dataset Engine:** Performs operations on structured data.
- **Visual Builder:** Allows programs to be created without writing code.
- **Editor:** Provides syntax highlighting, autocomplete, and diagnostics.

## Technology

- TypeScript
- Node.js
- Langium
- Vitest

## Development

Install dependencies:

```bash
npm install
```

Generate the parser and AST:

```bash
npm run langium:generate
```

Run the tests:

```bash
npx vitest run
```

Run an example program once the CLI is configured:

```bash
npx tsx src/cli.ts examples/hello.anomaly
```

## Development Roadmap

- [X] Variables and literals
- [ ] Mathematical expressions
- [ ] Text, booleans, and null
- [ ] Conditional statements
- [ ] Loops
- [ ] Functions
- [ ] Lists and records
- [ ] Dataset operations
- [ ] Visual builder
- [ ] Browser integration
- [ ] Code editor integration

## Language Status

**Version:** 0.1.0 — Early Development

Anomaly is currently under development. Its syntax, runtime behavior, and APIs may change before the first stable release.
