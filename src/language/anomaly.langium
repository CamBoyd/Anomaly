
grammar Anomaly

// ========================================
// PROGRAM STRUCTURE
// ========================================

entry Model:
    statements+=Statement*;

Statement:
    SetStatement | ShowStatement;

SetStatement:
    'set' name=ID '=' value=Expression;

ShowStatement:
    'show' value=Expression;


// ========================================
// EXPRESSIONS
// ========================================

// Entry point for all expressions
Expression:
    Addition;

// Addition and subtraction
Addition infers Expression:
    Multiplication
    (
        {infer BinaryExpression.left=current}
        operator=('+' | '-')
        right=Multiplication
    )*;

// Multiplication and division
Multiplication infers Expression:
    Unary
    (
        {infer BinaryExpression.left=current}
        operator=('*' | '/' | '%')
        right=Unary
    )*;

// Negative and positive values
Unary infers Expression:
    (
        {infer UnaryExpression}
        operator=('-' | '+')
        operand=Unary
    )
    | Exponentation;

// Exponents
Exponentation infers Expression:
    Primary
    (
        {infer BinaryExpression.left=current}
        operator=('^')
        right=Unary
    )?;

// Numbers, variables and parentheses
Primary infers Expression:
      NumberLiteral
    | VariableReference
    | '(' Expression ')';

NumberLiteral:
    value=NUMBER;

VariableReference:
    name=ID;


// ========================================
// TERMINALS
// ========================================

terminal NUMBER: /[0-9]+(\.[0-9]+)?/;

terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;

hidden terminal WS: /\s+/;

hidden terminal COMMENT: /#[^\r\n]*/;
