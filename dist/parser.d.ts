import { ErrorHandler } from './error-handler';
import * as Node from './nodes';
import { RawToken, Scanner, SourceLocation } from './scanner';
interface Config {
    range: boolean;
    loc: boolean;
    source: string | null;
    tokens: boolean;
    comment: boolean;
    tolerant: boolean;
}
interface Context {
    isModule: boolean;
    allowIn: boolean;
    allowStrictDirective: boolean;
    allowYield: boolean;
    await: boolean;
    firstCoverInitializedNameError: RawToken | null;
    isAssignmentTarget: boolean;
    isBindingElement: boolean;
    inFunctionBody: boolean;
    inIteration: boolean;
    inSwitch: boolean;
    labelSet: any;
    strict: boolean;
}
export interface Marker {
    index: number;
    line: number;
    column: number;
}
interface ArrowParameterPlaceHolderNode {
    type: string;
    params: Node.Expression[];
    wsBeforeOpening: string;
    separators: string[];
    wsBeforeClosing: string;
    async: boolean;
}
interface DeclarationOptions {
    inFor: boolean;
}
interface TokenEntry {
    type: string;
    value: string;
    regex?: {
        pattern: string;
        flags: string;
    };
    range?: [number, number];
    loc?: SourceLocation;
    wsBefore: string;
}
interface Arguments {
    parentheses: boolean;
    wsBeforeOpening: string;
    args: Node.ArgumentListElement[];
    separators: string[];
    wsBeforeClosing: string;
}
interface BindingList {
    declarations: Node.VariableDeclarator[];
    separators: string[];
}
interface FinallyClause {
    wsBeforeFinally: string;
    content: Node.BlockStatement;
}
interface ClassElementList {
    wsBeforeOpening: string;
    wsAfterOpening: string;
    properties: Node.Property[];
    wsBeforeClosing: string;
}
interface NamedImports {
    wsBeforeOpening: string;
    specifiers: Node.ImportSpecifier[];
    separators: string[];
    wsBeforeClosing: string;
}
interface ObjectPropertyKey {
    key: Node.PropertyKey;
    computed: boolean;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
}
export declare class Parser {
    readonly config: Config;
    readonly delegate: any;
    readonly errorHandler: ErrorHandler;
    readonly scanner: Scanner;
    readonly operatorPrecedence: any;
    lookahead: RawToken;
    hasLineTerminator: boolean;
    context: Context;
    tokens: any[];
    startMarker: Marker;
    lastMarker: Marker;
    constructor(code: string, options: any, delegate: any);
    throwError(messageFormat: string, ...values: any[]): void;
    tolerateError(messageFormat: any, ...values: any[]): void;
    unexpectedTokenError(token?: any, message?: string): Error;
    throwUnexpectedToken(token?: any, message?: any): never;
    tolerateUnexpectedToken(token?: any, message?: any): void;
    collectComments(): void;
    getTokenRaw(token: any): string;
    convertToken(token: RawToken): TokenEntry;
    nextToken(): RawToken;
    nextRegexToken(ws: string): RawToken;
    createNode(): Marker;
    startNode(token: any, lastLineStart?: number): Marker;
    finalize(marker: Marker, node: any): any;
    expect(value: any): string;
    expectCommaSeparator(): string;
    expectKeyword(keyword: any): string;
    match(value: any): boolean;
    matchKeyword(keyword: any): boolean;
    matchContextualKeyword(keyword: any): boolean;
    matchAssign(): boolean;
    isolateCoverGrammar(parseFunction: any): any;
    inheritCoverGrammar(parseFunction: any): any;
    consumeSemicolon(): string;
    parsePrimaryExpression(): Node.Expression;
    parseSpreadElement(): Node.SpreadElement;
    parseArrayInitializer(): Node.ArrayExpression;
    parsePropertyMethod(params: any): Node.BlockStatement;
    parsePropertyMethodFunction(): Node.FunctionExpression;
    parsePropertyMethodAsyncFunction(wsBeforeAsync: string): Node.FunctionExpression;
    parseObjectPropertyKey(): ObjectPropertyKey;
    isPropertyKey(key: any, value: any): boolean;
    parseObjectProperty(hasProto: any): Node.Property;
    parseObjectInitializer(): Node.ObjectExpression;
    parseTemplateHead(): Node.TemplateElement;
    parseTemplateElement(): Node.TemplateElement;
    parseTemplateLiteral(wsBefore: string): Node.TemplateLiteral;
    reinterpretExpressionAsPattern(expr: any): void;
    parseGroupExpression(): ArrowParameterPlaceHolderNode | Node.Expression;
    parseArguments(): Arguments;
    isIdentifierName(token: any): boolean;
    parseIdentifierName(): Node.Identifier;
    parseNewExpression(): Node.MetaProperty | Node.NewExpression;
    parseAsyncArgument(): Node.Expression;
    parseAsyncArguments(): Arguments;
    matchImportCall(): boolean;
    parseImportCall(): Node.Import;
    parseLeftHandSideExpressionAllowCall(): Node.Expression;
    parseSuper(): Node.Super;
    parseLeftHandSideExpression(): Node.Expression;
    parseUpdateExpression(): Node.Expression;
    parseAwaitExpression(): Node.AwaitExpression;
    parseUnaryExpression(): Node.Expression;
    parseExponentiationExpression(): Node.Expression;
    binaryPrecedence(token: any): number;
    parseBinaryExpression(): Node.Expression;
    parseConditionalExpression(): Node.Expression;
    checkPatternParam(options: any, param: any): void;
    reinterpretAsCoverFormalsList(expr: any): {
        simple: any;
        params: any[];
        stricted: any;
        firstRestricted: any;
        message: any;
        wsBeforeOpening: string;
        wsBeforeClosing: string;
        separators: string[];
        noparens: boolean;
    } | null;
    parseAssignmentExpression(): Node.Expression;
    parseExpression(): Node.Expression | Node.SequenceExpression;
    parseStatementListItem(): Node.StatementListItem;
    parseBlock(): Node.BlockStatement;
    parseLexicalBinding(kind: string, options: any): Node.VariableDeclarator;
    parseBindingList(kind: string, options: any): BindingList;
    isLexicalDeclaration(): boolean;
    parseLexicalDeclaration(options: any): Node.VariableDeclaration;
    parseBindingRestElement(params: any, kind?: string): Node.RestElement;
    parseArrayPattern(params: any, kind?: string): Node.ArrayPattern;
    parsePropertyPattern(params: any, kind?: string): Node.Property;
    parseRestProperty(params: any, kind: any): Node.RestElement;
    parseObjectPattern(params: any, kind?: string): Node.ObjectPattern;
    parsePattern(params: any, kind?: string): Node.BindingIdentifier | Node.BindingPattern;
    parsePatternWithDefault(params: any, kind?: string): Node.AssignmentPattern | Node.BindingIdentifier | Node.BindingPattern;
    parseVariableIdentifier(kind?: string): Node.Identifier;
    parseVariableDeclaration(options: DeclarationOptions): Node.VariableDeclarator;
    parseVariableDeclarationList(options: any): BindingList;
    parseVariableStatement(): Node.VariableDeclaration;
    parseEmptyStatement(): Node.EmptyStatement;
    parseExpressionStatement(): Node.ExpressionStatement;
    parseIfClause(): Node.Statement;
    parseIfStatement(): Node.IfStatement;
    parseDoWhileStatement(): Node.DoWhileStatement;
    parseWhileStatement(): Node.WhileStatement;
    parseForStatement(): Node.ForStatement | Node.ForInStatement | Node.ForOfStatement;
    parseContinueStatement(): Node.ContinueStatement;
    parseBreakStatement(): Node.BreakStatement;
    parseReturnStatement(): Node.ReturnStatement;
    parseWithStatement(): Node.WithStatement;
    parseSwitchCase(): Node.SwitchCase;
    parseSwitchStatement(): Node.SwitchStatement;
    parseLabelledStatement(): Node.LabeledStatement | Node.ExpressionStatement;
    parseThrowStatement(): Node.ThrowStatement;
    parseCatchClause(): Node.CatchClause;
    parseFinallyClause(): FinallyClause;
    parseTryStatement(): Node.TryStatement;
    parseDebuggerStatement(): Node.DebuggerStatement;
    parseStatement(): Node.Statement;
    parseFunctionSourceElements(): Node.BlockStatement;
    validateParam(options: any, param: any, name: any): void;
    parseRestElement(params: any): Node.RestElement;
    parseFormalParameter(options: any): void;
    parseFormalParameters(firstRestricted?: any): {
        simple: any;
        params: any;
        stricted: any;
        firstRestricted: any;
        message: any;
        wsBeforeOpening: string;
        wsBeforeClosing: string;
        separators: string[];
    };
    matchAsyncFunction(): boolean;
    parseFunctionDeclaration(identifierIsOptional?: boolean): Node.AsyncFunctionDeclaration | Node.FunctionDeclaration;
    parseFunctionExpression(): Node.AsyncFunctionExpression | Node.FunctionExpression;
    parseDirective(): Node.Directive | Node.ExpressionStatement;
    parseDirectivePrologues(): Node.StatementListItem[];
    qualifiedPropertyName(token: any): boolean;
    parseGetterMethod(): Node.FunctionExpression;
    parseSetterMethod(): Node.FunctionExpression;
    parseGeneratorMethod(wsBeforeStar: string): Node.FunctionExpression;
    isStartOfExpression(): boolean;
    parseYieldExpression(): Node.YieldExpression;
    parseClassElement(hasConstructor: any): Node.Property;
    parseClassElementList(): ClassElementList;
    parseClassBody(): Node.ClassBody;
    parseClassDeclaration(identifierIsOptional?: boolean): Node.ClassDeclaration;
    parseClassExpression(): Node.ClassExpression;
    parseModule(): Node.Module;
    parseScript(): Node.Script;
    parseModuleSpecifier(): Node.Literal;
    parseImportSpecifier(): Node.ImportSpecifier;
    parseNamedImports(): NamedImports;
    parseImportDefaultSpecifier(): Node.ImportDefaultSpecifier;
    parseImportNamespaceSpecifier(): Node.ImportNamespaceSpecifier;
    parseImportDeclaration(): Node.ImportDeclaration;
    parseExportSpecifier(): Node.ExportSpecifier;
    parseExportDeclaration(): Node.ExportDeclaration;
}
export {};
