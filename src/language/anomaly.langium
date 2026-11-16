
grammar Anomaly

// ========================================
// PROGRAM STRUCTURE
// ========================================

entry Model:
    statements+=Statement*;

Statement:
    SetStatement | ShowStatement | IfStatement;

SetStatement:
    'set' name=ID '=' value=Expression;

ShowStatement:
    'show' value=Expression;

IfStatement:
    'if' condition=Expression
        thenStatements+=Statement*
    (elseIfClauses+=ElseIfClause)*
    (
        'else'
        elseStatements+=Statement*
    )?
    'end';

ElseIfClause:
    'else' 'if' condition=Expression
        statements+=Statement*;

// ========================================
// EXPRESSIONS
// ========================================

// Entry point for all expressions
Expression:
    LogicalOr;

LogicalOr infers Expression:
    LogicalAnd
    (
        {infer BinaryExpression.left=current}
        operator='or'
        right=LogicalAnd
    )*;

LogicalAnd infers Expression:
    LogicalNot
    (
        {infer BinaryExpression.left=current}
        operator='and'
        right=LogicalNot
    )*;

LogicalNot infers Expression:
    (
        {infer LogicalNotExpression}
        'not'
        operand=LogicalNot
    )
    | Comparison;

Comparison infers Expression:
    Addition
    (
        {infer BinaryExpression.left=current}
        operator=(
            '==' | '!=' |
            '>=' | '<=' |
            '>'  | '<'
        )
        right=Addition
    )?;

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
    | BooleanLiteral
    | VariableReference
    | '(' Expression ')';

NumberLiteral:
    value=NUMBER;

BooleanLiteral:
    value?='true' | 'false';

VariableReference:
    name=ID;

// ========================================
// TERMINALS
// ========================================

terminal NUMBER: /[0-9]+(\.[0-9]+)?/;

terminal BOOLEAN: 'true' | 'false';

terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;

hidden terminal WS: /\s+/;

hidden terminal COMMENT: /#[^\r\n]*/;
