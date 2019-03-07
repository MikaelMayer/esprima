import { Syntax } from './syntax';

export type ArgumentListElement = Expression | SpreadElement;
export type ArrayExpressionElement = Expression | SpreadElement | null;
export type ArrayPatternElement = AssignmentPattern | BindingIdentifier | BindingPattern | RestElement | null;
export type BindingPattern = ArrayPattern | ObjectPattern;
export type BindingIdentifier = Identifier;
export type Declaration = AsyncFunctionDeclaration | ClassDeclaration | ExportDeclaration | FunctionDeclaration | ImportDeclaration | VariableDeclaration;
export type ExportableDefaultDeclaration = BindingIdentifier | BindingPattern | ClassDeclaration | Expression | FunctionDeclaration;
export type ExportableNamedDeclaration = AsyncFunctionDeclaration | ClassDeclaration | FunctionDeclaration | VariableDeclaration;
export type ExportDeclaration = ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration;
export type Expression = ArrayExpression | ArrowFunctionExpression | AssignmentExpression | AsyncArrowFunctionExpression | AsyncFunctionExpression |
    AwaitExpression | BinaryExpression | CallExpression | ClassExpression | ComputedMemberExpression |
    ConditionalExpression | Identifier | FunctionExpression | Literal | NewExpression | ObjectExpression |
    RegexLiteral | SequenceExpression | StaticMemberExpression | TaggedTemplateExpression |
    ThisExpression | UnaryExpression | UpdateExpression | YieldExpression;
export type FunctionParameter = AssignmentPattern | BindingIdentifier | BindingPattern;
export type ImportDeclarationSpecifier = ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier;
export type ObjectExpressionProperty = Property | SpreadElement;
export type ObjectPatternProperty = Property | RestElement;
export type Statement = AsyncFunctionDeclaration | BreakStatement | ContinueStatement | DebuggerStatement | DoWhileStatement |
    EmptyStatement | ExpressionStatement | Directive | ForStatement | ForInStatement | ForOfStatement |
    FunctionDeclaration | IfStatement | ReturnStatement | SwitchStatement | ThrowStatement |
    TryStatement | VariableDeclaration | WhileStatement | WithStatement;
export type PropertyKey = Identifier | Literal;
export type PropertyValue = AssignmentPattern | AsyncFunctionExpression | BindingIdentifier | BindingPattern | FunctionExpression;
export type StatementListItem = Declaration | Statement;
export type UnparseElement = { name: string, map?: any } | string;
export type UnparseArray = UnparseElement[];

// body might be empty, it should return ""
var singleChildMap = (body, unparser) => unparser(body);
var multiChildMap = (join = "") => (params, unparser) =>
         params.map(unparser).join(join);

//From any instance node, call node.__proto__.constructor.unparseData to get its unparsing data.

export function unparseDataOf(node) {
  return node.__proto__.constructor.unparseData;
}

export function unparse(node) {
  var els = node.__proto__.constructor.unparseData;
  var result = "";
  for(let e of els) {
    while(typeof e != "string") {
      if(typeof e == "object") {
        var m = e.map;
        e = node[e.name];
        if(m) {
          e = m(e, unparse);
        }
      } else {
        e = "" + e;
      }
    }
    result += e;
  }
  return result;
}

/* tslint:disable:max-classes-per-file */
/* type alias UnparseElement =
     ({name: string, map?: (typeof this[name], Node => string)  => UnparseElement} | string);
   type alias UnparseArray = UnparseElement[] */
export class ArrayExpression {
    readonly type: string;
    readonly elements: ArrayExpressionElement[];
    readonly wsBefore: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "[",
      {name: "elements", map: multiChildMap(",")},
      {name: "wsBeforeClosing"},
      "]"];
    constructor(wsBefore: string, wsBeforeClosing: string, elements: ArrayExpressionElement[]) {
        this.type = Syntax.ArrayExpression;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class ArrayPattern {
    readonly type: string;
    readonly elements: ArrayPatternElement[];
    readonly wsBefore: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = ArrayExpression.unparseData;
    constructor(wsBefore: string, wsBeforeClosing: string, elements: ArrayPatternElement[]) {
        this.type = Syntax.ArrayPattern;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class ArrowFunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement | Expression;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly wsBefore: string;
    readonly wsBeforeArrow: string;
    readonly arrow: string;
    static readonly unparseData: UnparseArray = [
      {name: "async", map: (async) => async ? {name: "wsBeforeAsync"} : ""},
      {name: "async", map: (async) => async ? "async" : ""},
      {name: "wsBefore"},
      {name: "params", map: multiChildMap() },
      {name: "wsBeforeArrow"},
      {name: "arrow"},
      {name: "body", map: singleChildMap }];
    constructor(wsBefore: string, params: FunctionParameter[], wsBeforeArrow: string, arrow: string, body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = false;
        this.wsBefore = wsBefore;
        this.wsBeforeArrow = wsBeforeArrow;
        this.arrow = arrow;
    }
}

var binaryUnparseData = [
  {name: "wsBefore"},
  {name: "left", map: singleChildMap},
  {name: "wsBeforeOp"},
  {name: "operator"},
  {name: "right", map: singleChildMap}
];
export class AssignmentExpression {
    readonly type: string;
    readonly operator: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly wsBefore: string;
    readonly wsBeforeOp: string;
    static readonly unparseData: UnparseArray = binaryUnparseData;
    constructor(wsBeforeOp: string, operator: string, left: Expression, right: Expression) {
        this.type = Syntax.AssignmentExpression;
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.wsBefore = "";
        this.wsBeforeOp = wsBeforeOp;
    }
}

export class AssignmentPattern {
    readonly type: string;
    readonly left: BindingIdentifier | BindingPattern;
    readonly right: Expression;
    readonly wsBeforeEq: string;
    static readonly unparseData: UnparseArray = [
      {name: "left", map: singleChildMap},
      {name: "wsBeforeEq"},
      "=",
      {name: "right", map: singleChildMap}]; 
    constructor(left: BindingIdentifier | BindingPattern, wsBeforeEq: string, right: Expression) {
        this.type = Syntax.AssignmentPattern;
        this.left = left;
        this.right = right;
        this.wsBeforeEq = wsBeforeEq;
    }
}

export class AsyncArrowFunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement | Expression;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly wsBeforeAsync: string;
    readonly wsBefore: string;
    readonly wsBeforeArrow: string;
    readonly arrow: string;
    static readonly unparseData: UnparseArray = ArrowFunctionExpression.unparseData; 
    constructor(wsBeforeAsync: string, wsBefore: string, params: FunctionParameter[], wsBeforeArrow: string, arrow: string, body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = true;
        this.wsBefore = wsBefore;
        this.wsBeforeArrow = wsBeforeArrow;
        this.arrow = arrow;
        this.wsBeforeAsync = wsBeforeAsync;
    }
}

var functionDeclarationUnparseData = [
  {name: "async", map: (async) => async ? {name: "wsBeforeAsync"} : ""},
  {name: "async", map: (async) => async ? "async" : ""},
  {name: "wsBefore"},
  {name: "displayFunction", map (t) => t ? "function" : "" },
  {name: "generator", map: (g) => g ? {name: "wsBeforeStar"} : ""},
  {name: "generator", map: (g) => g ? "*" : ""},
  {name: "id", map: (id) => id ? {name: "wsBeforeId"} : ""},
  {name: "id", map: (id) => id || ""},
  {name: "wsBeforeParams"},
  "(",
  {name: "params", map: multiChildMap(",")},
  {name: "wsBeforeEndParams"},
  ")",
  {name: "wsBeforeBody"},
  {name: "body"}
]
export class AsyncFunctionDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly displayFunction: boolean;
    readonly wsBeforeAsync: string;
    readonly wsBefore: string;
    readonly wsBeforeId: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeParams: string;
    readonly wsBeforeEndParams: string;
    readonly wsBeforeBody: string;
    static readonly unparseData: UnparseArray = functionDeclarationUnparseData; 
    constructor(wsBeforeAsync: string, wsBefore: string, displayFunction: boolean, wsBeforeId: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], wsBeforeEndParams: string, wsBeforeBody: string, body: BlockStatement) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
        this.displayFunction = displayFunction;
        this.wsBefore = wsBefore;
        this.wsBeforeAsync = wsBeforeAsync;
        this.wsBeforeId = wsBeforeId;
        this.wsBeforeStar = "";
        this.wsBeforeParams = wsBeforeParams;
        this.wsBeforeEndParams = wsBeforeEndParams;
        this.wsBeforeBody = wsBeforeBody;
    }
}

export class AsyncFunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly displayFunction: boolean;
    readonly wsBeforeAsync: string;
    readonly wsBefore: string;
    readonly wsBeforeId: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeParams: string;
    readonly wsBeforeEndParams: string;
    readonly wsBeforeBody: string;
    static readonly unparseData: UnparseArray = functionDeclarationUnparseData;
    constructor(wsBeforeAsync: string, wsBefore: string, displayFunction: boolean, wsBeforeId: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], wsBeforeEndParams: string, wsBeforeBody: string, body: BlockStatement) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
        this.displayFunction = displayFunction;
        this.wsBefore = wsBefore;
        this.wsBeforeAsync = wsBeforeAsync;
        this.wsBeforeId = wsBeforeId;
        this.wsBeforeStar = "";
        this.wsBeforeParams = wsBeforeParams;
        this.wsBeforeEndParams = wsBeforeEndParams;
        this.wsBeforeBody = wsBeforeBody;
    }
}

export class AwaitExpression {
    readonly type: string;
    readonly argument: Expression;
    readonly wsBefore: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "await",
      {name: "argument", map: singleChildMap}]; 
    constructor(wsBefore: string, argument: Expression) {
        this.type = Syntax.AwaitExpression;
        this.argument = argument;
        this.wsBefore = wsBefore;
    }
}

export class BinaryExpression {
    readonly type: string;
    readonly operator: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly wsBefore: string;
    readonly wsBeforeOp: string;
    static readonly unparseData: UnparseArray = binaryUnparseData; 
    constructor(operator: string, left: Expression, right: Expression, wsBefore: string, wsBeforeOp: string) {
        const logical = (operator === '||' || operator === '&&');
        this.type = logical ? Syntax.LogicalExpression : Syntax.BinaryExpression;
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.wsBefore = wsBefore;
        this.wsBeforeOp = wsBeforeOp;
    }
}

export class BlockStatement {
    readonly type: string;
    readonly body: Statement[];
    readonly wsBefore: string;
    readonly wsBeforeEnd: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "{",
        {name: "body", map: multiChildMap()},
        {name: "wsBeforeEnd"},
      "}"]; 
    constructor(wsBefore: string, wsBeforeEnd: string, body: Statement[]) {
        this.type = Syntax.BlockStatement;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeEnd = wsBeforeEnd;
    }
}

function controlLabelStatementUnparseData(name) {
  return [
    {name: "wsBefore"},
    name,
    {name: "wsBeforeLabel"},
    {name: "label", map: (label) => label || ""},
    {name: "semicolon"}
  ];
}
export class BreakStatement {
    readonly type: string;
    readonly label: Identifier | null;
    readonly wsBefore: string;
    readonly wsBeforeLabel: string;
    readonly semicolon: string;
    static readonly unparseData: UnparseArray = controlLabelStatementUnparseData("break"); 
    constructor(wsBefore: string, wsBeforeLabel: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.BreakStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.wsBeforeLabel = wsBeforeLabel;
        this.semicolon = semicolon;
    }
}

export class CallExpression {
    readonly type: string;
    readonly callee: Expression | Import;
    readonly arguments: ArgumentListElement[];
    readonly wsBefore: string;
    readonly wsBeforeArgs: string;
    readonly wsBeforeEndArgs: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      {name: "callee", map: singleChildMap},
      {name: "wsBeforeArgs"},
        {name: "callee", map: (e => e.type == Syntax.Import ? "" : "(")},
          {name: "arguments", map: multiChildMap(",")},
          {name: "wsBeforeEndArgs"},
        {name: "callee", map: (e => e.type == Syntax.Import ? "" : ")")},
    ];
    constructor(wsBefore: string, callee: Expression | Import, wsBeforeArgs: string, args: ArgumentListElement[], wsBeforeEndArgs: string) {
        this.type = Syntax.CallExpression;
        this.callee = callee;
        this.arguments = args;
        this.wsBefore = wsBefore;
        this.wsBeforeArgs = wsBeforeArgs;
        this.wsBeforeEndArgs = wsBeforeEndArgs;
    }
}

export class CatchClause {
    readonly type: string;
    readonly param: BindingIdentifier | BindingPattern;
    readonly body: BlockStatement;
    readonly wsBefore: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "catch",
      {name: "wsBeforeOpening"},
      "(",
      {name: "param", map: singleChildMap},
      {name: "wsBeforeClosing"},
      ")",
      {name: "body", map: singleChildMap}
    ];
    constructor(wsBefore: string, wsBeforeOpening: string, param: BindingIdentifier | BindingPattern, wsBeforeClosing: string, body: BlockStatement) {
        this.type = Syntax.CatchClause;
        this.param = param;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
export class ClassBody {
    readonly type: string;
    readonly body: Property[];
    static readonly unparseData: UnparseArray = [
      {name: "body", map: multiChildMap()}
    ];
    constructor(body: Property[]) {
        this.type = Syntax.ClassBody;
        this.body = body;
    }
}
export class ClassDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly superClass: Identifier | null;
    readonly body: ClassBody;
    readonly wsBefore: string;
    readonly wsBeforeId: string;
    readonly wsBeforeExtends: string;
    readonly wsBeforeSuperclass: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "class",
      {name: "wsBeforeId"},
      {name: "id", map: (id) => id || ""},
      {name: "superClass", map:(s) => s ? {name: "wsBeforeExtends"} : ""},
      {name: "superClass", map:(s) => s ? "extends" : ""},
      {name: "superClass", map:(s) => s ? {name: "wsBeforeSuperclass"} : ""},
      {name: "superClass", map: singleChildMap},
      {name: "wsBeforeOpening"},
      "{",
      {name: "body", map: singleChildMap},
      {name: "wsBeforeClosing"},
      "}"];
    constructor(wsBefore: string, wsBeforeId: string, id: Identifier | null,
                wsBeforeExtends: string, wsBeforeSuperclass: string, superClass: Identifier | null,
                wsBeforeOpening: string, body: ClassBody, wsBeforeClosing: string) {
        this.type = Syntax.ClassDeclaration;
        this.id = id;
        this.superClass = superClass;
        this.wsBefore = wsBefore;
        this.wsBeforeId = wsBeforeId;
        this.wsBeforeExtends = wsBeforeExtends;
        this.wsBeforeSuperclass = wsBeforeSuperclass;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.body = body;
    }
}

export class ClassExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly superClass: Identifier | null;
    readonly body: ClassBody;
    readonly wsBefore: string;
    readonly wsBeforeId: string;
    readonly wsBeforeExtends: string;
    readonly wsBeforeSuperclass: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = ClassDeclaration.unparseData;
    constructor(wsBefore: string, wsBeforeId: string, id: Identifier | null,
                wsBeforeExtends: string, wsBeforeSuperclass: string, superClass: Identifier | null,
                wsBeforeOpening: string, body: ClassBody, wsBeforeClosing: string) {
        this.type = Syntax.ClassExpression;
        this.id = id;
        this.superClass = superClass;
        this.wsBefore = wsBefore;
        this.wsBeforeId = wsBeforeId;
        this.wsBeforeExtends = wsBeforeExtends;
        this.wsBeforeSuperclass = wsBeforeSuperclass;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.body = body;
    }
}

export class ComputedMemberExpression {
    readonly type: string;
    readonly computed: boolean;
    readonly object: Expression;
    readonly property: Expression;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = [
      {name: "object", map: singleChildMap},
      {name: "wsBeforeOpening"},
      {name: "computed", map: (c) => c ? "[" : "."},
      {name: "property", map: singleChildMap},
      {name: "wsBeforeClosing"},
      {name: "computed", map: (c) => c ? "]" : ""},
      "]"]; 
    constructor(object: Expression, wsBeforeOpening: string, property: Expression, wsBeforeClosing: string) {
        this.type = Syntax.MemberExpression;
        this.computed = true;
        this.object = object;
        this.property = property;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
export class ConditionalExpression {
    readonly type: string;
    readonly test: Expression;
    readonly consequent: Expression;
    readonly alternate: Expression;
    readonly wsBeforeQues: string;
    readonly wsBeforeColon: string;
    static readonly unparseData: UnparseArray = [
      {name: "test", map: singleChildMap},
      {name: "wsBeforeQues"},
      "?",
      {name: "consequent", map: singleChildMap},
      {name: "wsBeforeColon"},
      ":",
      {name: "alternate", map: singleChildMap},
    ]; 
    constructor(test: Expression, wsBeforeQues: string, consequent: Expression, wsBeforeColon: string, alternate: Expression) {
        this.type = Syntax.ConditionalExpression;
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.wsBeforeQues = wsBeforeQues;
        this.wsBeforeColon = wsBeforeColon;
    }
}

export class ContinueStatement {
    readonly type: string;
    readonly label: Identifier | null;
    readonly wsBefore: string;
    readonly wsBeforeLabel: string;
    readonly semicolon: string;
    static readonly unparseData: UnparseArray =
      controlLabelStatementUnparseData("continue");; 
    constructor(wsBefore: string, wsBeforeLabel: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.ContinueStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.wsBeforeLabel = wsBeforeLabel;
        this.semicolon = semicolon;
    }
}

export class DebuggerStatement {
    readonly type: string;
    readonly wsBefore: string;
    readonly unparseData: UnparseArray =[
      {name: "wsBefore"},
      "debugger",
      {name: "semicolon"}]; 
    readonly semicolon: string;
    constructor(wsBefore: string, semicolon: string) {
        this.type = Syntax.DebuggerStatement;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class Directive {
    readonly type: string;
    readonly expression: Expression;
    readonly directive: string;
    readonly wsBeforeSemicolon: string;
    readonly unparseData: UnparseArray = [
      {name: "expression"},
      {name: "wsBeforeSemicolon"},
      ";"];
    constructor(expression: Expression, directive: string, wsBeforeSemicolon: string) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
        this.directive = directive;
        this.wsBeforeSemicolon = wsBeforeSemicolon;
    }
}

export class DoWhileStatement {
    readonly type: string;
    readonly body: Statement;
    readonly test: Expression;
    readonly wsBefore: string; 
    readonly wsBeforeWhile: string; 
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "do",
      {name: "body", map: singleChildMap},
      {name: "wsBeforeWhile"},
      "while",
      {name: "wsBeforeOpening"},
      "(",
      {name: "test", map: singleChildMap},
      {name: "wsBeforeClosing"},
      ")"]; 
    constructor(wsBefore: string, body: Statement, wsBeforeWhile: string, wsBeforeOpening: string, test: Expression, wsBeforeClosing: string) {
        this.type = Syntax.DoWhileStatement;
        this.body = body;
        this.test = test;
        this.wsBefore = wsBefore;
        this.wsBeforeWhile = wsBeforeWhile;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
export class EmptyStatement {
    readonly type: string;
    readonly wsBefore: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      ";"]; 
    constructor(wsBefore: string) {
        this.type = Syntax.EmptyStatement;
        this.wsBefore = wsBefore;
    }
}

export class ExportAllDeclaration {
    readonly type: string;
    readonly source: Literal;
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeFrom: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "export",
      {name: "wsBeforeStar"},
      "*",
      {name: "wsBeforeFrom"},
      "from",
      {name: "source", map: singleChildMap}];
    constructor(wsBefore: string, wsBeforeStar: string, wsBeforeFrom: string, source: Literal) {
        this.type = Syntax.ExportAllDeclaration;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeFrom = wsBeforeFrom;
        this.source = source;
    }
}

export class ExportDefaultDeclaration {
    readonly type: string;
    readonly declaration: ExportableDefaultDeclaration;
    readonly wsBefore: string;
    readonly wsBeforeDefault: string;
    readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "export",
      {name: "wsBeforeDefault"},
      "default",
      {name: "declaration", map: singleChildMap}];
    constructor(wsBefore: string, wsBeforeDefault: string, declaration: ExportableDefaultDeclaration) {
        this.type = Syntax.ExportDefaultDeclaration;
        this.declaration = declaration;
        this.wsBefore = wsBefore;
        this.wsBeforeDefault = wsBeforeDefault;
    }
}

export class ExportNamedDeclaration {
    readonly type: string;
    readonly declaration: ExportableNamedDeclaration | null;
    readonly specifiers: ExportSpecifier[];
    readonly source: Literal | null;
    readonly wsBefore: string;
    readonly wsBeforeDeclaration: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly wsBeforeFrom: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "export",
      {name: "declaration", map: (s) => s ? {name: "wsBeforeDeclaration"} : ""},
      {name: "declaration", singleChildMap},
      {name: "specifiers", map: (s) => s.length ? {name: "wsBeforeOpening"} : ""}, 
      {name: "specifiers", map: (s) => s.length ? "{" : ""}, 
      {name: "specifiers", map: multiChildMap(",")},
      {name: "specifiers", map: (s) => s.length ? {name: "wsBeforeClosing"} : ""}, 
      {name: "specifiers", map: (s) => s.length ? "}" : ""}, 
      {name: "source", map: (s) => s ? {name: "wsBeforeFrom"} : ""},
      {name: "source", map: (s) => s ? "from" : ""},
      {name: "source", map: singleChildMap}]; 
    constructor(wsBefore: string, wsBeforeDeclaration: string, declaration: ExportableNamedDeclaration | null,
                wsBeforeOpening: string, specifiers: ExportSpecifier[], wsBeforeClosing: string,
                wsBeforeFrom: string, source: Literal | null) {
        this.type = Syntax.ExportNamedDeclaration;
        this.declaration = declaration;
        this.specifiers = specifiers;
        this.source = source;
        this.wsBefore = wsBefore;
        this.wsBeforeDeclaration = wsBeforeDeclaration;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeFrom = wsBeforeFrom;
    }
}
export class ExportSpecifier {
    readonly type: string;
    readonly exported: Identifier;
    readonly local: Identifier;
    readonly same: boolean;
    readonly wsBefore: string;
    readonly wsBeforeAs: string;
    wsAfter?: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      {name: "local"},
      {name: "same", map: (same) => same ? "" : {name: "wsBeforeAs"}},
      {name: "same", map: (same) => same ? "" : "as"},
      {name: "same", map: (same) => same ? "" : {name: "exported"}},
      {name: "wsAfter", map: (ws) => ws || ""}];
    constructor(wsBefore: string, local: Identifier, wsBeforeAs: string, exported: Identifier) {
        this.type = Syntax.ExportSpecifier;
        this.exported = exported;
        this.local = local;
        this.same = exported == local;
        this.wsBefore = wsBefore;
        this.wsBeforeAs = wsBeforeAs;
    }
}

export class ExpressionStatement {
    readonly type: string;
    readonly expression: Expression;
    readonly semicolon: string;
    static readonly unparseData: UnparseArray = [
      {name: "expression", map: singleChildMap},
      {name: "semicolon"}];
    constructor(expression: Expression, semicolon: string) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
        this.semicolon = semicolon;
    }
}
var forUnparseData = (keyword, wsBeforeKeyword) => [
{name: "wsBeforeFor"},
"for",
{name: "wsBeforeOpening"},
"(",
{name: "left", map: singleChildMap},
{name: wsBeforeKeyword},
keyword,
{name: "right", map: singleChildMap},
{name: "wsBeforeClosing"},
")",
{name: "wsBody", map: singleChildMap}
];
export class ForInStatement {
    readonly type: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly body: Statement;
    readonly each: boolean;
    readonly wsBeforeFor: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeIn: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray =
      forUnparseData("in", "wsBeforeIn");
    constructor(wsBeforeFor: string, wsBeforeOpening: string,
      left: Expression, wsBeforeIn: string, right: Expression, wsBeforeClosing: string, body: Statement) {
        this.type = Syntax.ForInStatement;
        this.left = left;
        this.right = right;
        this.body = body;
        this.each = false;
        this.wsBeforeFor = wsBeforeFor;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeIn = wsBeforeIn;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class ForOfStatement {
    readonly type: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly body: Statement;
    readonly wsBeforeFor: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeOf: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray =
      forUnparseData("of", "wsBeforeOf");
    constructor(wsBeforeFor: string, wsBeforeOpening: string,
      left: Expression, wsBeforeOf: string, right: Expression, wsBeforeClosing: string, body: Statement) {
        this.type = Syntax.ForOfStatement;
        this.left = left;
        this.right = right;
        this.body = body;
        this.wsBeforeFor = wsBeforeFor;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeOf = wsBeforeOf;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class ForStatement {
    readonly type: string;
    readonly init: Expression | null;
    readonly test: Expression | null;
    readonly update: Expression | null;
    body: Statement;
    readonly wsBeforeFor: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeSemicolon1: string;
    readonly wsBeforeSemicolon2: string;
    readonly wsBeforeClosing: string;
    readonly unparseData: UnparseArray = [
      {name: "wsBeforeFor"},
      "for",
      {name: "wsBeforeOpening"},
      "(",
      {name: "init", map: singleChildMap},
      {name: "wsBeforeSemicolon1"},
      ";",
      {name: "test", map: singleChildMap},
      {name: "wsBeforeSemicolon2"},
      ";",
      {name: "update", map: singleChildMap},
      {name: "wsBeforeClosing"},
      ")",
      {name: "body", map: singleChildMap}];
    constructor(wsBeforeFor: string, wsBeforeOpening: string, init: Expression | null, wsBeforeSemicolon1: string, test: Expression | null, wsBeforeSemicolon2: string, update: Expression | null, wsBeforeClosing: string, body: Statement) {
        this.type = Syntax.ForStatement;
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
        this.wsBeforeFor = wsBeforeFor;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeSemicolon1 = wsBeforeSemicolon1;
        this.wsBeforeSemicolon2 = wsBeforeSemicolon2;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class FunctionDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly displayFunction: boolean;
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeId: string;
    readonly wsBeforeParams: string;
    readonly wsBeforeEndParams: string;
    readonly wsBeforeBody: string;
    static readonly unparseData: UnparseArray =
      functionDeclarationUnparseData; 
    constructor(wsBefore: string, displayFunction: boolean, wsBeforeStar: string, wsBeforeId: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], wsBeforeEndParams: string, wsBeforeBody: string, body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
        this.displayFunction = displayFunction;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeId = wsBeforeId;
        this.wsBeforeParams = wsBeforeParams;
        this.wsBeforeEndParams = wsBeforeEndParams;
        this.wsBeforeBody = wsBeforeBody;
    }
}
export class FunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly displayFunction: boolean;
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeId: string;
    readonly wsBeforeParams: string;
    readonly wsBeforeEndParams: string;
    readonly wsBeforeBody: string;
    static readonly unparseData: UnparseArray =
      functionDeclarationUnparseData;
    constructor(wsBefore: string, displayFunction: boolean, wsBeforeStar: string, wsBeforeId: string,
      id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], wsBeforeEndParams: string, wsBeforeBody: string, body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
        this.displayFunction = displayFunction;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeId = wsBeforeId;
        this.wsBeforeParams = wsBeforeParams;
        this.wsBeforeEndParams = wsBeforeEndParams;
        this.wsBeforeBody = wsBeforeBody;
    }
}

export class Identifier {
    readonly type: string;
    readonly name: string;
    readonly wsBefore: string;
    readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      {name: "name"}]; 
    constructor(wsBefore, name) {
        this.type = Syntax.Identifier;
        this.name = name;
        this.wsBefore = wsBefore;
    }
}
export class IfStatement {
    readonly type: string;
    readonly test: Expression;
    readonly consequent: Statement;
    readonly alternate: Statement | null;
    readonly wsBefore: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly wsBeforeElse: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "if",
      {name: "wsBeforeOpening"},
      "(",
      {name: "test", map: singleChildMap},
      {name: "wsBeforeClosing"},
      ")",
      {name: "consequent", map: singleChildMap},
      {name: "wsBeforeElse"},
      {name: "alternate", map: (a) => a ? "else" : ""},
      {name: "alternate", map: singleChildMap}]; 
    constructor(wsBefore: string, wsBeforeOpening: string, test: Expression,
      wsBeforeClosing: string, consequent: Statement, wsBeforeElse: string, alternate: Statement | null) {
        this.type = Syntax.IfStatement;
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeElse = wsBeforeElse;
    }
}
var importUnparseData = ;
export class Import {
    readonly type: string;
    readonly wsBefore: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"}, "import"]; 
    constructor(wsBefore) {
        this.type = Syntax.Import;
        this.wsBefore = wsBefore;
    }
}

export class ImportDeclaration {
    readonly type: string;
    readonly specifiers: ImportDeclarationSpecifier[];
    readonly source: Literal;
    readonly wsBefore: string;
    readonly wsBeforeFrom: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "import",
      {name: "specifiers", map: multiChildMap(",")},
      {name: "specifiers", map: (sp) => sp.length ? {name: "wsBeforeFrom"} : ""},
      {name: "specifiers", map: (sp) => sp.length ? "from" : ""},
      {name: "source", map: singleChildMap}]; 
    constructor(wsBefore: string, specifiers, wsBeforeFrom: string, source) {
        this.type = Syntax.ImportDeclaration;
        this.specifiers = specifiers;
        this.source = source;
        this.wsBefore = wsBefore;
        this.wsBeforeFrom = wsBeforeFrom;
    }
}
export class ImportDefaultSpecifier {
    readonly type: string;
    readonly local: Identifier;
    static readonly unparseData: UnparseArray = [
      {name: "local", map: singleChildMap}]; 
    constructor(local: Identifier) {
        this.type = Syntax.ImportDefaultSpecifier;
        this.local = local;
    }
}
export class ImportNamespaceSpecifier {
    readonly type: string;
    readonly local: Identifier;
    readonly wsBefore: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "*",
      {name: "local", map: singleChildMap}]; 
    constructor(wsBefore: string, local: Identifier) {
        this.type = Syntax.ImportNamespaceSpecifier;
        this.wsBefore = wsBefore;
        this.local = local;
    }
}

export class ImportSpecifier {
    readonly type: string;
    readonly local: Identifier;
    readonly imported: Identifier;
    readonly asPresent: boolean;
    readonly wsBeforeAs: string;
    static readonly unparseData: UnparseArray = [
      {name: "imported", singleChildMap},
      {name: "wsBeforeAs"},
      {name: "asPresent", map: (p) => p ? "as" : ""},
      {name: "asPresent", map: (p) => p ? {name: "local", map: singleChildMap} : ""}];
    constructor(local: Identifier, asPresent: boolean, wsBeforeAs: string, imported: Identifier) {
        this.type = Syntax.ImportSpecifier;
        this.local = local;
        this.imported = imported;
        this.asPresent = asPresent;
        this.wsBeforeAs = wsBeforeAs;
    }
}

export class LabeledStatement {
    readonly type: string;
    readonly label: Identifier;
    readonly body: Statement;
    readonly wsBeforeColon: string;
    static readonly unparseData: UnparseArray = [
      {name: "label", map: singleChildMap},
      {name: "wsBeforeColon"},
      ":",
      {name: "body", map: singleChildMap},
      ];
    constructor(label: Identifier, wsBeforeColon: string, body: Statement) {
        this.type = Syntax.LabeledStatement;
        this.label = label;
        this.body = body;
        this.wsBeforeColon = wsBeforeColon;
    }
}
function unescapeCharSequence(string: string): string {
  return string.replace(/[\\\b\f\n\r\t\v]/g, function(m) {
      switch(m) {
        case "\\": return "\\\\";
        case "\b": return "\\b";
        case "\f": return "\\f";
        case "\n": return "\\n";
        case "\r": return "\\r";
        case "\t": return "\\t";
        case "\v": return "\\v";
        default: return m;
      }
    });
}

function uneval(x: any): string {
  if(typeof x == "string") {
    return toExpString(x);
  }
  if(typeof x == "number" || typeof x == "boolean") {
    return "" + x;
  }
  if(typeof x == "object" && x == null) {
    return "null";
  }
  if(typeof x == "object" && typeof x.length == "number") { // Arrays
    var result: string[] = [];
    x = x as any[];
    for(var i = 0; i < x.length; i++) {
      result.push(uneval(x[i]));
    }
    return "[" + result.join(",") + "]";
  }
  if(typeof x == "object") {
    var result: string[] = [];
    for(var k in x) {
      result.push(k + ":" + uneval(x[k]));
    }
    return "{" + result.join(", ") + "}";
  }
  return "" + x;
}
function toExpString(string, raw?) {
  var charDelim = raw && raw.length >= 1 && (raw[0] == "\"" || raw[0] == "`" || raw[0] == "'") ? raw[0] : '"';
  return charDelim + unescapeCharSequence(string).replace(charDelim, "\\" + charDelim) + charDelim;
}

var literalUnparseData = 
export class Literal {
    readonly type: string;
    readonly value: boolean | number | string | null;
    readonly raw: string;
    readonly wsBefore: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      {name: "raw", map: (raw) => false ? "" :
        {name: "value", map: (value) => 
          typeof value == "string" ?
            toExpString(value, raw) :
          typeof value == "object" ?
            value === null ?
              "null" :
              uneval(value) :
          "" + value
        }
      }]; 
    constructor(wsBefore: string, value: boolean | number | string | null, raw: string) {
        this.type = Syntax.Literal;
        this.value = value;
        this.raw = raw;
        this.wsBefore = wsBefore;
    }
}

export class MetaProperty {
    readonly type: string;
    readonly meta: Identifier;
    readonly property: Identifier;
    readonly wsBeforeDot: string;
    readonly unparseData: UnparseArray = [
      {name: "meta", map: singleChildMap},
        {name: "wsBeforeDot"},
        ".",
        {name: "property", map: singleChildMap}];
    constructor(meta: Identifier, wsBeforeDot: string, property: Identifier) {
        this.type = Syntax.MetaProperty;
        this.meta = meta;
        this.property = property;
        this.wsBeforeDot = wsBeforeDot;
    }
}

export class MethodDefinition {
    readonly type: string;
    readonly key: Expression;
    readonly computed: boolean;
    readonly value: AsyncFunctionExpression | FunctionExpression | null;
    readonly kind: string;
    readonly static: boolean;
    readonly wsBeforeStatic: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBeforeStatic"},
      {name: "static", map: (s) => s ? "static", ""},
      {name: "key", map: (key, unparser) => {
        var keyStr = unparser(key);
        return {name: "value", map: (value, unparser) => {
          var result = unparser(value);
          return result.replace(/\(/, keyStr + "(")
      }];
    constructor(wsBeforeStatic: string, key: Expression, computed: boolean, value: AsyncFunctionExpression | FunctionExpression | null, kind: string, isStatic: boolean) {
        this.type = Syntax.MethodDefinition;
        this.key = key;
        this.computed = computed;
        this.value = value;
        this.kind = kind;
        this.static = isStatic;
        this.wsBeforeStatic = wsBeforeStatic;
    }
}

export class Module {
    readonly type: string;
    readonly body: StatementListItem[];
    readonly sourceType: string;
    static readonly unparseData: UnparseArray = [
      {name: "body", map: multiChildMap("")}
    ];
    constructor(body: StatementListItem[]) {
        this.type = Syntax.Program;
        this.body = body;
        this.sourceType = 'module';
    }
}

export class NewExpression {
    readonly type: string;
    readonly callee: Expression;
    readonly arguments: ArgumentListElement[];
    readonly wsBeforeNew: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBeforeNew"},
      "new",
      {name: "callee"},
      {name: "wsBeforeOpening"},
      "(",
      {name: "arguments", map: multiChildMap(",")},
      {name: "wsBeforeClosing"},
      ")"
    ];
    constructor(wsBeforeNew: string, callee: Expression, wsBeforeOpening: string, args: ArgumentListElement[], wsBeforeClosing: string) {
        this.type = Syntax.NewExpression;
        this.callee = callee;
        this.arguments = args;
        this.wsBeforeNew = wsBeforeNew;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class ObjectExpression {
    readonly type: string;
    readonly properties: ObjectExpressionProperty[];
    readonly wsBefore: string;
    readonly wsBeforeClosing: string;
    static readonly unparseData: UnparseArray = [
      {name: "wsBefore"},
      "{",
      {name: "properties", multiChildMap(",")},
      {name, "wsBeforeClosing", map (w) => w || ""},
      "}"
    ];
    constructor(wsBefore: string, properties: ObjectExpressionProperty[], wsBeforeClosing: string) {
        this.type = Syntax.ObjectExpression;
        this.properties = properties;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class ObjectPattern {
    readonly type: string;
    readonly properties: ObjectPatternProperty[];
    readonly wsBefore: string;
    readonly wsBeforeClosing: string | null;
    static readonly unparseData: UnparseArray = {
      {name: "wsBefore"},
      "{",
      {name: "properties", multiChildMap(",")},
      {name, "wsBeforeClosing", map (w) => w || ""},
    }; 
    constructor(wsBefore: string, properties: ObjectPatternProperty[], wsBeforeClosing: string) {
        this.type = Syntax.ObjectPattern;
        this.properties = properties;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class Property {
    readonly type: string;
    readonly key: PropertyKey;
    readonly computed: boolean;
    readonly value: PropertyValue | null;
    readonly kind: string;
    readonly method: boolean;
    readonly shorthand: boolean;
    readonly unparseData: UnparseArray; 
    constructor(kind: string, key: PropertyKey, computed: boolean, value: PropertyValue | null, method: boolean, shorthand: boolean) {
        this.type = Syntax.Property;
        this.key = key;
        this.computed = computed;
        this.value = value;
        this.kind = kind;
        this.method = method;
        this.shorthand = shorthand;
    }
}

export class RegexLiteral {
    readonly type: string;
    readonly value: RegExp;
    readonly raw: string;
    readonly regex: { pattern: string, flags: string };
    readonly unparseData: UnparseArray; 
    constructor(value: RegExp, raw: string, pattern: string, flags: string) {
        this.type = Syntax.Literal;
        this.value = value;
        this.raw = raw;
        this.regex = { pattern, flags };
    }
}

export class RestElement {
    readonly type: string;
    readonly argument: BindingIdentifier | BindingPattern;
    readonly unparseData: UnparseArray; 
    constructor(argument: BindingIdentifier | BindingPattern) {
        this.type = Syntax.RestElement;
        this.argument = argument;
    }
}

export class ReturnStatement {
    readonly type: string;
    readonly argument: Expression | null;
    readonly unparseData: UnparseArray; 
    constructor(argument: Expression | null) {
        this.type = Syntax.ReturnStatement;
        this.argument = argument;
    }
}

export class Script {
    readonly type: string;
    readonly body: StatementListItem[];
    readonly sourceType: string;
    readonly unparseData: UnparseArray; 
    constructor(body: StatementListItem[]) {
        this.type = Syntax.Program;
        this.body = body;
        this.sourceType = 'script';
    }
}

export class SequenceExpression {
    readonly type: string;
    readonly expressions: Expression[];
    readonly unparseData: UnparseArray; 
    constructor(expressions: Expression[]) {
        this.type = Syntax.SequenceExpression;
        this.expressions = expressions;
    }
}

export class SpreadElement {
    readonly type: string;
    readonly argument: Expression;
    readonly wsBefore: string;
    wsAfter: string;
    readonly unparseData: UnparseArray; 
    constructor(wsBefore: string, argument: Expression) {
        this.type = Syntax.SpreadElement;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.unparseData = [
          {name:"wsBefore"},
          "..."];
        this.wsAfter = "";
    }
}

export class StaticMemberExpression {
    readonly type: string;
    readonly computed: boolean;
    readonly object: Expression;
    readonly property: Expression;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly unparseData: UnparseArray; 
    constructor(object: Expression, wsBeforeOpening: string, property: Expression) {
        this.type = Syntax.MemberExpression;
        this.computed = false;
        this.object = object;
        this.property = property;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = "";
        this.unparseData = memberUnparseData;
    }
}

export class Super {
    readonly type: string;
    readonly unparseData: UnparseArray; 
    constructor() {
        this.type = Syntax.Super;
    }
}

export class SwitchCase {
    readonly type: string;
    readonly test: Expression | null;
    readonly consequent: Statement[];
    readonly unparseData: UnparseArray; 
    constructor(test: Expression, consequent: Statement[]) {
        this.type = Syntax.SwitchCase;
        this.test = test;
        this.consequent = consequent;
    }
}

export class SwitchStatement {
    readonly type: string;
    readonly discriminant: Expression;
    readonly cases: SwitchCase[];
    readonly unparseData: UnparseArray; 
    constructor(discriminant: Expression, cases: SwitchCase[]) {
        this.type = Syntax.SwitchStatement;
        this.discriminant = discriminant;
        this.cases = cases;
    }
}

export class TaggedTemplateExpression {
    readonly type: string;
    readonly tag: Expression;
    readonly quasi: TemplateLiteral;
    readonly unparseData: UnparseArray; 
    constructor(tag: Expression, quasi: TemplateLiteral) {
        this.type = Syntax.TaggedTemplateExpression;
        this.tag = tag;
        this.quasi = quasi;
    }
}

interface TemplateElementValue {
    cooked: string;
    raw: string;
}

export class TemplateElement {
    readonly type: string;
    readonly value: TemplateElementValue;
    readonly tail: boolean;
    readonly unparseData: UnparseArray; 
    constructor(value: TemplateElementValue, tail: boolean) {
        this.type = Syntax.TemplateElement;
        this.value = value;
        this.tail = tail;
    }
}

export class TemplateLiteral {
    readonly type: string;
    readonly quasis: TemplateElement[];
    readonly expressions: Expression[];
    readonly unparseData: UnparseArray; 
    constructor(quasis: TemplateElement[], expressions: Expression[]) {
        this.type = Syntax.TemplateLiteral;
        this.quasis = quasis;
        this.expressions = expressions;
    }
}

export class ThisExpression {
    readonly type: string;
    readonly unparseData: UnparseArray; 
    constructor() {
        this.type = Syntax.ThisExpression;
    }
}

export class ThrowStatement {
    readonly type: string;
    readonly argument: Expression;
    readonly unparseData: UnparseArray; 
    constructor(argument: Expression) {
        this.type = Syntax.ThrowStatement;
        this.argument = argument;
    }
}

export class TryStatement {
    readonly type: string;
    readonly block: BlockStatement;
    readonly handler: CatchClause | null;
    readonly finalizer: BlockStatement | null;
    readonly unparseData: UnparseArray; 
    constructor(block: BlockStatement, handler: CatchClause | null, finalizer: BlockStatement | null) {
        this.type = Syntax.TryStatement;
        this.block = block;
        this.handler = handler;
        this.finalizer = finalizer;
    }
}

export class UnaryExpression {
    readonly type: string;
    readonly operator: string;
    readonly argument: Expression;
    readonly prefix: boolean;
    readonly wsBefore: string;
    readonly unparseData: UnparseArray; 
    constructor(wsBefore: string, operator, argument) {
        this.type = Syntax.UnaryExpression;
        this.operator = operator;
        this.argument = argument;
        this.prefix = true;
        this.wsBefore = wsBefore;
        this.unparseData = [{name: "wsBefore"}, {name: "operator"}, {name: "argument", map: singleChildMap}];
    }
}

export class UpdateExpression {
    readonly type: string;
    readonly operator: string;
    readonly argument: Expression;
    readonly prefix: boolean;
    readonly unparseData: UnparseArray; 
    constructor(operator, argument, prefix) {
        this.type = Syntax.UpdateExpression;
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
    }
}

export class VariableDeclaration {
    readonly type: string;
    readonly declarations: VariableDeclarator[];
    readonly kind: string;
    readonly unparseData: UnparseArray; 
    constructor(declarations: VariableDeclarator[], kind: string) {
        this.type = Syntax.VariableDeclaration;
        this.declarations = declarations;
        this.kind = kind;
    }
}

export class VariableDeclarator {
    readonly type: string;
    readonly id: BindingIdentifier | BindingPattern;
    readonly init: Expression | null;
    readonly unparseData: UnparseArray; 
    constructor(id: BindingIdentifier | BindingPattern, init: Expression | null) {
        this.type = Syntax.VariableDeclarator;
        this.id = id;
        this.init = init;
    }
}

export class WhileStatement {
    readonly type: string;
    readonly test: Expression;
    readonly body: Statement;
    readonly unparseData: UnparseArray; 
    constructor(test: Expression, body: Statement) {
        this.type = Syntax.WhileStatement;
        this.test = test;
        this.body = body;
    }
}

export class WithStatement {
    readonly type: string;
    readonly object: Expression;
    readonly body: Statement;
    readonly unparseData: UnparseArray; 
    constructor(object: Expression, body: Statement) {
        this.type = Syntax.WithStatement;
        this.object = object;
        this.body = body;
    }
}

export class YieldExpression {
    readonly type: string;
    readonly argument: Expression | null;
    readonly delegate: boolean;
    readonly unparseData: UnparseArray; 
    constructor(argument: Expression | null, delegate: boolean) {
        this.type = Syntax.YieldExpression;
        this.argument = argument;
        this.delegate = delegate;
    }
}
