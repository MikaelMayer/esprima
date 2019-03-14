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
    RegexLiteral | SequenceExpression | StaticMemberExpression | TemplateLiteral | TaggedTemplateExpression | Import |
    ThisExpression | UnaryExpression | UpdateExpression | YieldExpression;
export type FunctionParameter = AssignmentPattern | BindingIdentifier | BindingPattern;
export type ImportDeclarationSpecifier = ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier;
export type ObjectExpressionProperty = Property | SpreadElement;
export type ObjectPatternProperty = Property | RestElement;
export type Statement = AsyncFunctionDeclaration | BreakStatement | ContinueStatement | DebuggerStatement | DoWhileStatement |
    EmptyStatement | ExpressionStatement | Directive | ForStatement | ForInStatement | ForOfStatement |
    FunctionDeclaration | IfStatement | ReturnStatement | SwitchStatement | ThrowStatement |
    TryStatement | VariableDeclaration | WhileStatement | WithStatement | BlockStatement | LabeledStatement;
export type PropertyKey = Identifier | Literal;
export type PropertyValue = AssignmentPattern | AsyncFunctionExpression | BindingIdentifier | BindingPattern | FunctionExpression;
export type StatementListItem = Declaration | Statement;
export type UnparseElement = { name?: string, map?: any } | string;
export type UnparseArray = UnparseElement[];

export interface Unparsable {
  unparse(unparsable? : Unparsable): string;
}
export type UnparsableOrNull = Unparsable | null;
export var unparseChildren = (parent:any = undefined,
  join: string | string[] = "", defaultJoin = "") => (children: UnparsableOrNull[]) => {
  if(children) {
    var renderedChildren = children.map(child => child ? child.unparse(parent) : "");
    if(typeof join == "string") {
      return renderedChildren.join(join);
    }
    var result = "";
    for(var i = 0; i < renderedChildren.length; i++) {
      result += renderedChildren[i];
      if(i < join.length) {
        result += join[i];
      } else if(i < renderedChildren.length - 1) {
        if(join.length > 0) {
          result += join[join.length - 1];
        } else {
          result += defaultJoin;
        }
      }
    }
    return result;
  }
  return "";
}

export var unparseChild = (parent: any = undefined) => (node: UnparsableOrNull) =>  node ? node.unparse(parent) : "";

function unparseArray(
  this: ArrayExpression | ArrayPattern,
  parent) {
  return this.wsBeforeOpening +
    "[" +
    unparseChildren(this, this.separators, ", ")(this.elements) +
    this.wsBeforeClosing +
    "]" +
    this.wsAfter;
}

/* tslint:disable:max-classes-per-file */
/* type alias UnparseElement =
     ({name: string, map?: (typeof this[name], (Node, ParentNode?) => string, Node, ParentNode?)  => UnparseElement} | string);
   type alias UnparseArray = UnparseElement[] */
export class ArrayExpression {
    readonly type: string;
    readonly elements: ArrayExpressionElement[];
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly separators: string[];
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return unparseArray.bind(this)(parent);
    };
    constructor(wsBeforeOpening: string, elements: ArrayExpressionElement[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ArrayExpression;
        this.elements = elements;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.separators = separators;
    }
}

export class ArrayPattern {
    readonly type: string;
    readonly elements: ArrayPatternElement[];
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly separators: string[];
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return unparseArray.bind(this)(parent);
    };
    constructor(wsBeforeOpening: string, elements: ArrayPatternElement[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ArrayPattern;
        this.elements = elements;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.separators = separators;
    }
}

var arrowFunctionUnparser = function(this: ArrowFunctionExpression | AsyncArrowFunctionExpression, parent) {
  return (this.async ? this.wsBeforeAsync + "async" : "") +
    this.wsBefore +
    (this.params.length == 1 && this.noparens ? "" : "(") +
    unparseChildren(this, this.separators, ", ")(this.params) +
    this.wsBeforeClosing +
    (this.params.length == 1 && this.noparens ? "" : ")") +
    this.wsBeforeArrow +
    this.arrow +
    unparseChild(this)(this.body) +
    this.wsAfter;
}
export class ArrowFunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement | Expression;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly noparens: boolean;
    readonly wsBeforeAsync: string = "";    
    readonly wsBefore: string;
    readonly separators: string[];
    readonly wsBeforeClosing: string;
    readonly wsBeforeArrow: string;
    readonly arrow: string = "=>";
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return arrowFunctionUnparser.bind(this)(parent);
    };
    constructor(wsBefore: string, params: FunctionParameter[], separators: string[], wsBeforeClosing: string, noparens: boolean, wsBeforeArrow: string, body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = false;
        this.wsBefore = wsBefore;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeArrow = wsBeforeArrow;
        this.noparens = noparens;
    }
}

function binaryUnparser(this: AssignmentExpression | BinaryExpression | AssignmentPattern, parent: any) {
  return unparseChild(this)(this.left) +
    this.wsBeforeOp +
    this.operator +
    unparseChild(this)(this.right) +
    this.wsAfter;
}
export class AssignmentExpression {
    readonly type: string;
    readonly operator: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly wsBeforeOp: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return binaryUnparser.bind(this)(parent);
    }
    constructor(wsBeforeOp: string, operator: string, left: Expression, right: Expression) {
        this.type = Syntax.AssignmentExpression;
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.wsBeforeOp = wsBeforeOp;
    }
}

export class AssignmentPattern {
    readonly type: string;
    readonly left: BindingIdentifier | BindingPattern;
    readonly right: Expression;
    readonly wsBeforeOp: string;
    readonly operator = "=";
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return binaryUnparser.bind(this)(parent);
    }
    constructor(left: BindingIdentifier | BindingPattern, wsBeforeOp: string, right: Expression) {
        this.type = Syntax.AssignmentPattern;
        this.left = left;
        this.right = right;
        this.wsBeforeOp = wsBeforeOp;
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
    readonly noparens: boolean;
    readonly wsBeforeAsync: string;
    readonly wsBefore: string;
    readonly separators: string[];
    readonly wsBeforeClosing: string;
    readonly wsBeforeArrow: string;
    readonly arrow: string = "=>";
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return arrowFunctionUnparser.bind(this)(parent);
    };
    constructor(wsBeforeAsync: string, wsBefore: string, params: FunctionParameter[], separators: string[], wsBeforeClosing: string, noparens: boolean, wsBeforeArrow: string, body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = true;
        this.wsBefore = wsBefore;
        this.wsBeforeArrow = wsBeforeArrow;
        this.noparens = noparens;
        this.separators = [];
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeAsync = wsBeforeAsync;
    }
}

export type AnyFunctionExpression = AsyncFunctionDeclaration | FunctionDeclaration |
AsyncFunctionExpression | FunctionExpression;
// Context-sensitive unparsing definition.
// If a method, the async and generator (*) are already managed, and the word "function" does not appear.
var functionDeclarationUnparser = function(this: AnyFunctionExpression, parent) {
  var isFunctionMethod = parent && parent.type == Syntax.Property && parent.method;
  return (isFunctionMethod ? "" :
    this.async && this.wsBeforeAsync ? this.wsBeforeAsync + "async" : "") +
    this.wsBefore +
    (isFunctionMethod ? "" : "function" + 
      (this.generator ? this.wsBeforeStar + "*" : "")
    ) +
    unparseChild(this)(this.id) +
    this.wsBeforeParams +
    "(" +
    unparseChildren(this, this.separators, ", ")(this.params) +
    this.wsBeforeEndParams +
    ")" +
    unparseChild(this)(this.body) +
    this.wsAfter;
}
export class AsyncFunctionDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly wsBeforeAsync: string;
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeParams: string;
    readonly separators: string[];
    readonly wsBeforeEndParams: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBeforeAsync: string, wsBefore: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
        this.wsBefore = wsBefore;
        this.wsBeforeAsync = wsBeforeAsync;
        this.wsBeforeStar = "";
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
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
    readonly wsBeforeAsync: string;
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeParams: string;
    readonly separators: string[];
    readonly wsBeforeEndParams: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBeforeAsync: string, wsBefore: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
        this.wsBefore = wsBefore;
        this.wsBeforeAsync = wsBeforeAsync;
        this.wsBeforeStar = "";
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
    }
}

export class AwaitExpression {
    readonly type: string;
    readonly argument: Expression;
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "await" +
        unparseChild(this)(this.argument) + this.wsAfter;
    }
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
    readonly wsBeforeOp: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return binaryUnparser.bind(this)(parent);
    }
    constructor(operator: string, left: Expression, right: Expression, wsBeforeOp: string) {
        const logical = (operator === '||' || operator === '&&');
        this.type = logical ? Syntax.LogicalExpression : Syntax.BinaryExpression;
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.wsBeforeOp = wsBeforeOp;
    }
}

export class BlockStatement {
    readonly type: string;
    readonly body: StatementListItem[];
    readonly wsBefore: string;
    readonly wsBeforeEnd: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        "{" +
        unparseChildren(this)(this.body) +
        this.wsBeforeEnd +
        "}";
    }
    constructor(wsBefore: string, body: StatementListItem[], wsBeforeEnd: string) {
        this.type = Syntax.BlockStatement;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeEnd = wsBeforeEnd;
    }
}

var controlLabelStatementUnparseData = function(this: BreakStatement | ContinueStatement, parent, name) {
  return this.wsBefore +
    name +
    unparseChild(this)(this.label) +
    this.semicolon;
}
export class BreakStatement {
    readonly type: string;
    readonly label: Identifier | null;
    readonly wsBefore: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return controlLabelStatementUnparseData.bind(this)(parent, "break");
    }
    constructor(wsBefore: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.BreakStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class CallExpression {
    readonly type: string;
    readonly callee: Expression | Import;
    readonly arguments: ArgumentListElement[];
    readonly wsBeforeArgs: string;
    readonly separators: string[];
    readonly wsBeforeEndArgs: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.callee) +
        this.wsBeforeArgs +
        (this.callee.type == Syntax.Import ? "" : "(") +
        unparseChildren(this, this.separators, ", ")(this.arguments) +
        this.wsBeforeEndArgs +
        (this.callee.type == Syntax.Import ? "" : ")") +
        this.wsAfter;
    }
    constructor(callee: Expression | Import, wsBeforeArgs: string, args: ArgumentListElement[], separators: string[], wsBeforeEndArgs: string) {
        this.type = Syntax.CallExpression;
        this.callee = callee;
        this.arguments = args;
        this.wsBeforeArgs = wsBeforeArgs;
        this.separators = separators;
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
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        "catch" +
        this.wsBeforeOpening +
        "(" +
        unparseChild(this)(this.param) +
        this.wsBeforeClosing +
        ")" +
        unparseChild(this)(this.body);
    }
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
    readonly wsBeforeOpening: string;
    readonly wsAfterOpening: string;
    readonly wsBeforeClosing: string;
    unparse(parent?: Unparsable): string {
      return this.wsBeforeOpening +
       "{" +
       this.wsAfterOpening +
       unparseChildren(this)(this.body) +
       this.wsBeforeClosing + 
       "}";
    }
    constructor(wsBeforeOpening: string, wsAfterOpening: string, body: Property[], wsBeforeClosing: string) {
        this.type = Syntax.ClassBody;
        this.body = body;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsAfterOpening = wsAfterOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var classDeclarationUnparser = function(this: ClassDeclaration | ClassExpression, parent) {
  return this.wsBefore +
        "class" +
        unparseChild(this)(this.id) +
        (this.superClass ? this.wsBeforeExtends + "extends" + 
        unparseChild(this)(this.superClass) : "") +
        unparseChild(this)(this.body) +
        this.wsAfter;
}
export class ClassDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly superClass: Identifier | null;
    readonly body: ClassBody;
    readonly wsBefore: string;
    readonly wsBeforeExtends: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return classDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBefore: string, id: Identifier | null,
                wsBeforeExtends: string,
                superClass: Identifier | null,
                body: ClassBody) {
        this.type = Syntax.ClassDeclaration;
        this.id = id;
        this.superClass = superClass;
        this.wsBefore = wsBefore;
        this.wsBeforeExtends = wsBeforeExtends;
        this.body = body;
    }
}

export class ClassExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly superClass: Identifier | null;
    readonly body: ClassBody;
    readonly wsBefore: string;
    readonly wsBeforeExtends: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return classDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBefore: string, id: Identifier | null,
                wsBeforeExtends: string,
                superClass: Identifier | null,
                body: ClassBody) {
        this.type = Syntax.ClassExpression;
        this.id = id;
        this.superClass = superClass;
        this.wsBefore = wsBefore;
        this.wsBeforeExtends = wsBeforeExtends;
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
    wsAfter: string = "";
    unparse() {
      return unparseChild(this)(this.object) +
        this.wsBeforeOpening +
        (this.computed ? "[" : "") +
        unparseChild(this)(this.property) +
        this.wsBeforeClosing +
        (this.computed ? "]" : "") +
        this.wsAfter;
    }
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
    wsAfter: string = "";
    unparse() {
      return unparseChild(this)(this.test) +
        this.wsBeforeQues +
        "?" +
        unparseChild(this)(this.consequent) +
        this.wsBeforeColon +
        ":" +
        unparseChild(this)(this.alternate) +
        this.wsAfter;
    }; 
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
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return controlLabelStatementUnparseData.bind(this)(parent, "continue");
    };
    constructor(wsBefore: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.ContinueStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
export class DebuggerStatement {
    readonly type: string;
    readonly wsBefore: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        "debugger" +
        this.semicolon;
    }
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
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.expression) +
        this.wsBeforeSemicolon + ";";
    };
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
    readonly semicolon: string;
    unparse() {
      return this.wsBefore +
       "do" +
       unparseChild(this)(this.body) +
       this.wsBeforeWhile +
       "while" +
       this.wsBeforeOpening +
       "(" +
       unparseChild(this)(this.test) +
       this.wsBeforeClosing +
       ")" + this.semicolon;
    }
    constructor(wsBefore: string, body: Statement, wsBeforeWhile: string, wsBeforeOpening: string, test: Expression, wsBeforeClosing: string, semicolon: string) {
        this.type = Syntax.DoWhileStatement;
        this.body = body;
        this.test = test;
        this.wsBefore = wsBefore;
        this.wsBeforeWhile = wsBeforeWhile;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.semicolon = semicolon;
    }
}
export class EmptyStatement {
    readonly type: string;
    readonly wsBefore: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + this.semicolon;
    }
    constructor(wsBefore: string, semicolon: string = ";") {
        this.type = Syntax.EmptyStatement;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class ExportAllDeclaration {
    readonly type: string;
    readonly source: Literal;
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeFrom: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        "export" +
        this.wsBeforeStar +
        "*" +
        this.wsBeforeFrom +
        "from" +
        unparseChild(this)(this.source) +
        this.semicolon;
    }
    constructor(wsBefore: string, wsBeforeStar: string, wsBeforeFrom: string, source: Literal, semicolon: string = "") {
        this.type = Syntax.ExportAllDeclaration;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeFrom = wsBeforeFrom;
        this.source = source;
        this.semicolon = semicolon;
    }
}

export class ExportDefaultDeclaration {
    readonly type: string;
    readonly declaration: ExportableDefaultDeclaration;
    readonly wsBefore: string;
    readonly wsBeforeDefault: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        "export" +
        this.wsBeforeDefault +
        "default" +
        unparseChild(this)(this.declaration) +
        this.semicolon;
    }
    constructor(wsBefore: string, wsBeforeDefault: string, declaration: ExportableDefaultDeclaration, semicolon: string = "") {
        this.type = Syntax.ExportDefaultDeclaration;
        this.declaration = declaration;
        this.wsBefore = wsBefore;
        this.wsBeforeDefault = wsBeforeDefault;
        this.semicolon = semicolon;
    }
}

export class ExportNamedDeclaration {
    readonly type: string;
    readonly declaration: ExportableNamedDeclaration | null;
    readonly specifiers: ExportSpecifier[];
    readonly source: Literal | null;
    readonly wsBefore: string;
    readonly wsBeforeOpening: string;
    readonly separators: string[];
    readonly wsBeforeClosing: string;
    readonly wsBeforeFrom: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        "export" +
        (this.declaration ?
           unparseChild(this)(this.declaration): "") +
        (this.specifiers.length ? 
          this.wsBeforeOpening + "{" + unparseChildren(this, this.separators, ",")(this.specifiers) + this.wsBeforeClosing + "}"
          : ""
        ) + 
        (this.source ? this.wsBeforeFrom + "from" + unparseChild(this)(this.source) : "") + this.semicolon;
    }
    constructor(wsBefore: string, declaration: ExportableNamedDeclaration | null,
                wsBeforeOpening: string, specifiers: ExportSpecifier[], separators: string[], wsBeforeClosing: string,
                wsBeforeFrom: string, source: Literal | null, semicolon: string = "") {
        this.type = Syntax.ExportNamedDeclaration;
        this.declaration = declaration;
        this.specifiers = specifiers;
        this.source = source;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeFrom = wsBeforeFrom;
        this.semicolon = semicolon;
    }
}
export class ExportSpecifier {
    readonly type: string;
    readonly exported: Identifier;
    readonly local: Identifier;
    readonly noAs: boolean;
    readonly wsBeforeAs: string;
    wsAfter?: string;
    unparse(parent?: Unparsable): string {
      var localStr = unparseChild(this)(this.local);
      var exportedStr = unparseChild(this)(this.exported);
      return localStr +
        (this.noAs && localStr == exportedStr ? "" : this.wsBeforeAs + "as" + unparseChild(this)(this.exported)) +
        (this.wsAfter || "");
    }
    constructor(local: Identifier, noAs: boolean, wsBeforeAs: string, exported: Identifier) {
        this.type = Syntax.ExportSpecifier;
        this.exported = exported;
        this.local = local;
        this.noAs = noAs;
        this.wsBeforeAs = wsBeforeAs;
    }
}

export class ExpressionStatement {
    readonly type: string;
    readonly expression: Expression;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.expression) + this.semicolon;
    }
    constructor(expression: Expression, semicolon: string) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
        this.semicolon = semicolon;
    }
}
var forCollectionUnparser = function(this: ForInStatement | ForOfStatement, parent, keyword) {
  return this.wsBeforeFor + "for" + this.wsBeforeOpening + "(" +
    unparseChild(this)(this.left) +
    this.wsBeforeKeyword + keyword +
    unparseChild(this)(this.right) +
    this.wsBeforeClosing + ")" +
    unparseChild(this)(this.body);
}
export class ForInStatement {
    readonly type: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly body: Statement;
    readonly each: boolean;
    readonly wsBeforeFor: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeKeyword: string;
    readonly wsBeforeClosing: string;
    unparse(parent?: Unparsable): string {
      return forCollectionUnparser.bind(this)(parent, "in");
    }
    constructor(wsBeforeFor: string, wsBeforeOpening: string,
      left: Expression, wsBeforeKeyword: string, right: Expression, wsBeforeClosing: string, body: Statement) {
        this.type = Syntax.ForInStatement;
        this.left = left;
        this.right = right;
        this.body = body;
        this.each = false;
        this.wsBeforeFor = wsBeforeFor;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeKeyword = wsBeforeKeyword;
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
    readonly wsBeforeKeyword: string;
    readonly wsBeforeClosing: string;
    unparse(parent?: Unparsable): string {
      return forCollectionUnparser.bind(this)(parent, "of");
    }
    constructor(wsBeforeFor: string, wsBeforeOpening: string,
      left: Expression, wsBeforeKeyword: string, right: Expression, wsBeforeClosing: string, body: Statement) {
        this.type = Syntax.ForOfStatement;
        this.left = left;
        this.right = right;
        this.body = body;
        this.wsBeforeFor = wsBeforeFor;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeKeyword = wsBeforeKeyword;
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
    unparse(parent?: Unparsable): string {
      return this.wsBeforeFor + "for" + this.wsBeforeOpening + "(" +
        unparseChild(this)(this.init) +
        this.wsBeforeSemicolon1+ ";" +
        unparseChild(this)(this.test) +
        this.wsBeforeSemicolon2 + ";" +
        unparseChild(this)(this.update) +
        this.wsBeforeClosing + ")" +
        unparseChild(this)(this.body);
    }
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
    readonly wsBeforeAsync: string = "";
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeParams: string;
    readonly separators: string[];
    readonly wsBeforeEndParams: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBefore: string, wsBeforeStar: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
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
    readonly wsBeforeAsync: string = "";
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly wsBeforeParams: string;
    readonly separators: string[];
    readonly wsBeforeEndParams: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBefore: string, wsBeforeStar: string,
      id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
    }
}

export class Identifier {
    readonly type: string;
    readonly name: string;
    readonly wsBefore: string;
    readonly wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + this.name + this.wsAfter;
    }
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
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "if" +
        this.wsBeforeOpening + "(" +
        unparseChild(this)(this.test) +
        this.wsBeforeClosing + ")" +
        unparseChild(this)(this.consequent) +
        (this.alternate ?
           this.wsBeforeElse + "else" + unparseChild(this)(this.alternate) : "");
    }
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

export class Import {
    readonly type: string;
    readonly wsBefore: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "import";
    }
    constructor(wsBefore) {
        this.type = Syntax.Import;
        this.wsBefore = wsBefore;
    }
}

export class ImportDeclaration {
    readonly type: string;
    // At most one default specifier 
    // Followed by one ImportNamespaceSpecifier or many {ImportSpecifier}
    readonly specifiers: ImportDeclarationSpecifier[];
    readonly source: Literal;
    readonly wsBefore: string;
    readonly separators: string[];
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly wsBeforeFrom: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      var result = this.wsBefore + "import";
      if(this.specifiers.length == 0) {
        return result + unparseChild(this)(this.source) + this.semicolon;
      }
      var insideImportSpecifiers = false;
      for(var i = 0; i < this.specifiers.length; i++) {
        var specifier = this.specifiers[i];
        if(specifier.type == Syntax.ImportSpecifier) {
          if(!insideImportSpecifiers) {
            result += this.wsBeforeOpening + "{";
            insideImportSpecifiers = true;
          }
        }
        result += unparseChild(this)(specifier);
        if(i < this.separators.length) {
          result += this.separators[i];
        } else if(i < this.specifiers.length - 1) {
          result += ', ';
        }
      }
      if(insideImportSpecifiers) {
        result += this.wsBeforeClosing + "}";
      }
      return result + this.wsBeforeFrom + "from" +
         unparseChild(this)(this.source) + this.semicolon;
    }
    constructor(wsBefore: string, wsBeforeOpening: string, specifiers: ImportDeclarationSpecifier[], separators: string[], wsBeforeClosing: string, wsBeforeFrom: string, source, semicolon: string = "") {
        this.type = Syntax.ImportDeclaration;
        this.specifiers = specifiers;
        this.source = source;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeFrom = wsBeforeFrom;
        this.semicolon = semicolon;
    }
}
export class ImportDefaultSpecifier {
    readonly type: string;
    readonly local: Identifier;
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.local);
    }
    constructor(local: Identifier) {
        this.type = Syntax.ImportDefaultSpecifier;
        this.local = local;
    }
}
export class ImportNamespaceSpecifier {
    readonly type: string;
    readonly local: Identifier;
    readonly wsBefore: string;
    readonly wsBeforeAs: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "*" + this.wsBeforeAs + "as" + unparseChild(this)(this.local);
    }
    constructor(wsBefore: string, wsBeforeAs: string, local: Identifier) {
        this.type = Syntax.ImportNamespaceSpecifier;
        this.wsBefore = wsBefore;
        this.wsBeforeAs = wsBeforeAs;
        this.local = local;
    }
}

export class ImportSpecifier {
    readonly type: string;
    readonly local: Identifier;
    readonly imported: Identifier;
    readonly asPresent: boolean;
    readonly wsBeforeAs: string;
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.imported) +
        (this.asPresent ? this.wsBeforeAs + "as" + unparseChild(this)(this.local) : "");
    }
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
    readonly body: Statement | ClassDeclaration;
    readonly wsBeforeColon: string;
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.label) +
        this.wsBeforeColon + ":" +
        unparseChild(this)(this.body);
    }
    constructor(label: Identifier, wsBeforeColon: string, body: Statement | ClassDeclaration) {
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

export class Literal {
    readonly type: string;
    readonly value: boolean | number | string | null;
    readonly raw: string;
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        (typeof this.value == "string" ?
            toExpString(this.value, this.raw) :
          typeof this.value == "object" ?
            this.value === null ?
              "null" :
              uneval(this.value) :
          "" + this.value) + this.wsAfter;
    }
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
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.meta) +
        this.wsBeforeDot + "." +
        unparseChild(this)(this.property);
    }
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
    unparse(parent?: Unparsable): string {
      var keyStr = this.key.unparse(this);
      var result = this.value ? this.value.unparse(this) : "";
      return (this.static ? this.wsBeforeStatic + "static": "") +
        result.replace(/\(/, keyStr + "(");
    }
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
    unparse(parent?: Unparsable): string {
      return unparseChildren(this)(this.body);
    }
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
    readonly parentheses: boolean;
    readonly wsBeforeOpening: string;
    readonly separators: string[];
    readonly wsBeforeClosing: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBeforeNew + "new" +
        unparseChild(this)(this.callee) +
        (this.parentheses || this.arguments.length > 0 ? 
          this.wsBeforeOpening + "(" +
          unparseChildren(this, this.separators, ", ")(this.arguments) +
          this.wsBeforeClosing + ")"
        : "") +
        this.wsAfter;
    }
    constructor(wsBeforeNew: string, callee: Expression, parentheses: boolean, wsBeforeOpening: string, args: ArgumentListElement[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.NewExpression;
        this.callee = callee;
        this.arguments = args;
        this.wsBeforeNew = wsBeforeNew;
        this.parentheses = parentheses;
        this.wsBeforeOpening = wsBeforeOpening;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var objectExpressionPatternUnparse = function(this: ObjectExpression | ObjectPattern) {
  return this.wsBefore + "{" +
    unparseChildren(this, this.separators, ", ")(this.properties) +
    this.wsBeforeClosing + "}"  + this.wsAfter;
}
export class ObjectExpression {
    readonly type: string;
    readonly properties: ObjectExpressionProperty[];
    readonly wsBefore: string;
    readonly wsBeforeClosing: string;
    readonly separators: string[];
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return objectExpressionPatternUnparse.bind(this)();
    }
    constructor(wsBefore: string, properties: ObjectExpressionProperty[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ObjectExpression;
        this.properties = properties;
        this.wsBefore = wsBefore;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class ObjectPattern {
    readonly type: string;
    readonly properties: ObjectPatternProperty[];
    readonly wsBefore: string;
    readonly separators: string[];
    readonly wsBeforeClosing: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return objectExpressionPatternUnparse.bind(this)();
    }
    constructor(wsBefore: string, properties: ObjectPatternProperty[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ObjectPattern;
        this.properties = properties;
        this.wsBefore = wsBefore;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
function isFunctionExpression(e: any): e is AnyFunctionExpression {
   return e.type === Syntax.FunctionExpression;
}
export class Property {
    readonly type: string;
    readonly key: PropertyKey;
    readonly computed: boolean;
    readonly value: PropertyValue | null;
    readonly kind: string;
    readonly method: boolean;
    readonly shorthand: boolean;
    readonly wsBeforeColon: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return (this.method && this.value ? 
        isFunctionExpression(this.value) ?
          (this.value.async ? this.value.wsBeforeAsync + "async" : "") +
          (this.value.generator ? this.value.wsBeforeStar + "*" : "") : ""
      : "") +
        unparseChild(this)(this.key) +
        (this.method ? this.wsBeforeColon + ":" : "") +
        (this.shorthand ? "" : unparseChild(this)(this.value)) + this.wsAfter;
    }
    constructor(kind: string, key: PropertyKey, wsBeforeColon: string, computed: boolean, value: PropertyValue | null, method: boolean, shorthand: boolean) {
        this.type = Syntax.Property;
        this.key = key;
        this.computed = computed;
        this.value = value;
        this.kind = kind;
        this.method = method;
        this.shorthand = shorthand;
        this.wsBeforeColon = wsBeforeColon;
    }
}

export class RegexLiteral {
    readonly type: string;
    readonly value: RegExp;
    readonly raw: string;
    readonly regex: { pattern: string, flags: string };
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "/" +
        this.regex.pattern.replace(/\\/g, "\\\\").replace(/\//g, "\\/") +
        "/" +
        this.regex.flags + this.wsAfter;
    }
    constructor(wsBefore: string, value: RegExp, raw: string, pattern: string, flags: string) {
        this.type = Syntax.Literal;
        this.value = value;
        this.raw = raw;
        this.regex = { pattern, flags };
        this.wsBefore = wsBefore;
    }
}

export class RestElement {
    readonly type: string;
    readonly argument: BindingIdentifier | BindingPattern;
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "..." +
        unparseChild(this)(this.argument) +
        this.wsAfter;
    }
    constructor(wsBefore: string, argument: BindingIdentifier | BindingPattern) {
        this.type = Syntax.RestElement;
        this.argument = argument;
        this.wsBefore = wsBefore;
    }
}

export class ReturnStatement {
    readonly type: string;
    readonly argument: Expression | null;
    readonly wsBefore: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "return" +
        unparseChild(this)(this.argument) +
        this.semicolon;
    }
    constructor(wsBefore: string, argument: Expression | null, semicolon: string) {
        this.type = Syntax.ReturnStatement;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class Script {
    readonly type: string;
    readonly body: StatementListItem[];
    readonly sourceType: string;
    readonly wsAfter: string;
    unparse(parent?: Unparsable): string {
      return unparseChildren(this)(this.body) +
        this.wsAfter;
    }
    constructor(body: StatementListItem[], wsAfter: string) {
        this.type = Syntax.Program;
        this.body = body;
        this.sourceType = 'script';
        this.wsAfter = wsAfter;
    }
}

export class SequenceExpression {
    readonly type: string;
    readonly expressions: Expression[];
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly parentheses: boolean;
    readonly separators: string[];
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return (this.parentheses ? this.wsBeforeOpening + "(" : "") + unparseChildren(this, this.separators, ", ")(this.expressions) + (this.parentheses ? this.wsBeforeClosing + ")" : "") + this.wsAfter;
    }
    constructor(parentheses: boolean, wsBeforeOpening: string, expressions: Expression[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.SequenceExpression;
        this.expressions = expressions;
        this.parentheses = parentheses;
        this.wsBeforeOpening = wsBeforeOpening;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class SpreadElement {
    readonly type: string;
    readonly argument: Expression;
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "..." +
        unparseChild(this)(this.argument) +
        this.wsAfter;
    }
    constructor(wsBefore: string, argument: Expression) {
        this.type = Syntax.SpreadElement;
        this.argument = argument;
        this.wsBefore = wsBefore;
    }
}

export class StaticMemberExpression {
    readonly type: string;
    readonly computed: boolean;
    readonly object: Expression;
    readonly property: Expression;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    wsAfter: string = "";
    unparse() {
      return unparseChild(this)(this.object) +
        this.wsBeforeOpening +
        (this.computed ? "[" : "") +
        unparseChild(this)(this.property) +
        this.wsBeforeClosing +
        (this.computed ? "]" : "") + this.wsAfter;
    }
    constructor(object: Expression, wsBeforeOpening: string, property: Expression) {
        this.type = Syntax.MemberExpression;
        this.computed = false;
        this.object = object;
        this.property = property;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = "";
    }
}

export class Super {
    readonly type: string;
    readonly wsBefore: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "super";
    }
    constructor(wsBefore: string) {
        this.type = Syntax.Super;
        this.wsBefore = wsBefore;
    }
}

export class SwitchCase {
    readonly type: string;
    readonly test: Expression | null;
    readonly consequent: StatementListItem[];
    readonly wsBefore: string;
    readonly wsBeforeColon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + (this.test ? "case" + unparseChild(this)(this.test): "default") +
        this.wsBeforeColon + ":" +
        unparseChildren(this)(this.consequent);
    }
    constructor(wsBefore: string, test: Expression, wsBeforeColon: string, consequent: StatementListItem[]) {
        this.type = Syntax.SwitchCase;
        this.test = test;
        this.consequent = consequent;
        this.wsBefore = wsBefore;
        this.wsBeforeColon = wsBeforeColon;
    }
}

export class SwitchStatement {
    readonly type: string;
    readonly discriminant: Expression;
    readonly cases: SwitchCase[];
    readonly wsBefore: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    readonly wsBeforeBlockOpening: string;
    readonly wsBeforeBlockClosing: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "switch" + this.wsBeforeOpening +
        "(" + unparseChild(this)(this.discriminant) + this.wsBeforeClosing +
        ")" + this.wsBeforeBlockOpening + "{" +
        unparseChildren(this)(this.cases) +
        this.wsBeforeBlockClosing + "}"
    }
    constructor(wsBefore: string, wsBeforeOpening: string, discriminant: Expression, wsBeforeClosing: string, wsBeforeBlockOpening: string, cases: SwitchCase[], wsBeforeBlockClosing: string) {
        this.type = Syntax.SwitchStatement;
        this.discriminant = discriminant;
        this.cases = cases;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeBlockOpening = wsBeforeBlockOpening;
        this.wsBeforeBlockClosing = wsBeforeBlockClosing;
    }
}

export class TaggedTemplateExpression {
    readonly type: string;
    readonly tag: Expression;
    readonly quasi: TemplateLiteral;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.tag) + unparseChild(this)(this.quasi) + 
        this.wsAfter;
    }
    constructor(tag: Expression, quasi: TemplateLiteral) {
        this.type = Syntax.TaggedTemplateExpression;
        this.tag = tag;
        this.quasi = quasi;
    }
}

interface TemplateElementValue {
    cooked: string; // Only this one matter for unparsing.
    raw: string;
}

export class TemplateElement {
    readonly type: string;
    readonly value: TemplateElementValue;
    readonly tail: boolean;
    unparse(parent?: Unparsable): string {
      return this.value.cooked.replace(/\\/g, "\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
    }
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
    readonly wsBefore: string;
    unparse(parent?: Unparsable): string {
      var result = "";
      for(var i = 0; i < this.quasis.length; i++) {
        result += unparseChild(this)(this.quasis[i]) + (i < this.expressions.length ? "${" + unparseChild(this)(this.expressions[i]) + "}" : "");
      }
      return this.wsBefore + "`" + result + "`";
    }
    constructor(wsBefore: string, quasis: TemplateElement[], expressions: Expression[]) {
        this.type = Syntax.TemplateLiteral;
        this.quasis = quasis;
        this.expressions = expressions;
        this.wsBefore = wsBefore;
    }
}

export class ThisExpression {
    readonly type: string;
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "this" + this.wsAfter;
    }
    constructor(wsBefore: string) {
        this.type = Syntax.ThisExpression;
        this.wsBefore = wsBefore;
    }
}

export class ThrowStatement {
    readonly type: string;
    readonly argument: Expression;
    readonly wsBefore: string;
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "throw" + unparseChild(this)(this.argument) + this.semicolon;
    }
    constructor(wsBefore: string, argument: Expression, semicolon: string) {
        this.type = Syntax.ThrowStatement;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class TryStatement {
    readonly type: string;
    readonly block: BlockStatement;
    readonly handler: CatchClause | null;
    readonly finalizer: BlockStatement | null;
    readonly wsBefore: string;
    readonly wsBeforeFinally: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "try" + unparseChild(this)(this.handler) +
        (this.finalizer ? this.wsBeforeFinally + "finally" + unparseChild(this)(this.finalizer) : "");
    }
    constructor(wsBefore: string, block: BlockStatement, handler: CatchClause | null, wsBeforeFinally: string, finalizer: BlockStatement | null) {
        this.type = Syntax.TryStatement;
        this.block = block;
        this.handler = handler;
        this.finalizer = finalizer;
        this.wsBefore = wsBefore;
        this.wsBeforeFinally = wsBeforeFinally;
    }
}

export class UnaryExpression {
    readonly type: string;
    readonly operator: string;
    readonly argument: Expression;
    readonly prefix: boolean;
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + this.operator +
        unparseChild(this)(this.argument) + this.wsAfter;
    }
    constructor(wsBefore: string, operator, argument) {
        this.type = Syntax.UnaryExpression;
        this.operator = operator;
        this.argument = argument;
        this.prefix = true;
        this.wsBefore = wsBefore;
    }
}

export class UpdateExpression {
    readonly type: string;
    readonly operator: string;
    readonly argument: Expression;
    readonly prefix: boolean;
    readonly wsBefore: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return (this.prefix ? this.wsBefore + this.operator : "") +
        unparseChild(this)(this.argument) +
        (this.prefix ? "" : this.wsBefore + this.operator) +
        this.wsAfter;
    }
    constructor(wsBefore: string, operator, argument, prefix) {
        this.type = Syntax.UpdateExpression;
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
        this.wsBefore = wsBefore;
    }
}

export class VariableDeclaration {
    readonly type: string;
    readonly declarations: VariableDeclarator[];
    readonly kind: string;
    readonly wsBefore: string;
    readonly separators: string[];
    readonly semicolon: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + this.kind + unparseChildren(this, this.separators, ", ")(this.declarations) +
        this.semicolon;
    }
    constructor(wsBefore: string, declarations: VariableDeclarator[], separators: string[], kind: string, semicolon: string) {
        this.type = Syntax.VariableDeclaration;
        this.declarations = declarations;
        this.kind = kind;
        this.wsBefore = wsBefore;
        this.separators = separators;
        this.semicolon = semicolon;
    }
}

export class VariableDeclarator {
    readonly type: string;
    readonly id: BindingIdentifier | BindingPattern;
    readonly init: Expression | null;
    readonly wsBeforeEq: string;
    unparse(parent?: Unparsable): string {
      return unparseChild(this)(this.id) +
        (this.init ? this.wsBeforeEq + "=" + unparseChild(this)(this.init) : "");
    }
    constructor(id: BindingIdentifier | BindingPattern, wsBeforeEq: string, init: Expression | null) {
        this.type = Syntax.VariableDeclarator;
        this.id = id;
        this.wsBeforeEq = wsBeforeEq;
        this.init = init;
    }
}

export class WhileStatement {
    readonly type: string;
    readonly test: Expression;
    readonly body: Statement;
    readonly wsBefore: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "while" + this.wsBeforeOpening +
        "(" + unparseChild(this)(this.test) + this.wsBeforeClosing + ")" +
        unparseChild(this)(this.body);
    }
    constructor(wsBefore: string, wsBeforeOpening: string, test: Expression, wsBeforeClosing: string, body: Statement) {
        this.type = Syntax.WhileStatement;
        this.test = test;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class WithStatement {
    readonly type: string;
    readonly object: Expression;
    readonly body: Statement;
    readonly wsBefore: string;
    readonly wsBeforeOpening: string;
    readonly wsBeforeClosing: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "with" + this.wsBeforeOpening + "(" +
        unparseChild(this)(this.object) + this.wsBeforeClosing + ")" +
        unparseChild(this)(this.body);
    }
    constructor(wsBefore: string, wsBeforeOpening: string, object: Expression, wsBeforeClosing: string, body: Statement) {
        this.type = Syntax.WithStatement;
        this.object = object;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class YieldExpression {
    readonly type: string;
    readonly argument: Expression | null;
    readonly delegate: boolean;
    readonly wsBefore: string;
    readonly wsBeforeStar: string;
    readonly semicolon: string;
    wsAfter: string = "";
    unparse(parent?: Unparsable): string {
      return this.wsBefore + "yield" + (this.delegate ? this.wsBeforeStar + "*" : "") +
        (this.argument ? unparseChild(this)(this.argument) : "") + this.semicolon + this.wsAfter;
    }
    constructor(wsBefore: string, wsBeforeStar: string, argument: Expression | null, delegate: boolean, semicolon: string) {
        this.type = Syntax.YieldExpression;
        this.argument = argument;
        this.delegate = delegate;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.semicolon = semicolon;
    }
}
