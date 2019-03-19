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
export type PropertyKey = Identifier | Literal | Expression;
export type PropertyValue = AssignmentPattern | AsyncFunctionExpression | BindingIdentifier | BindingPattern | FunctionExpression;
export type StatementListItem = Declaration | Statement;
export type UnparseElement = { name?: string, map?: any } | string;
export type UnparseArray = UnparseElement[];

export interface Unparsable {
  wsBefore: string;
  unparse(unparsable?: Unparsable): string;
  wsAfter: string;
}
export type UnparsableOrNull = Unparsable | null;
export let unparseChildren = (parent: any = undefined,
                              join: string | string[] = '', defaultJoin = '') => (children: UnparsableOrNull[]) => {
  if (children) {
    const renderedChildren = children.map((child) => child ? child.unparse(parent) : '');
    if (typeof join === 'string') {
      return renderedChildren.join(join);
    }
    let result = '';
    for (let i = 0; i < renderedChildren.length; i++) {
      result += renderedChildren[i];
      if (i < join.length) {
        result += join[i];
      } else if (i < renderedChildren.length - 1) {
        if (join.length > 0) {
          result += join[join.length - 1];
        } else {
          result += defaultJoin;
        }
      }
    }
    return result;
  }
  return '';
};

export let unparseChild = (parent: any = undefined) => (node: UnparsableOrNull) =>  node ? node.unparse(parent) : '';

function unparseArray(
  this: ArrayExpression | ArrayPattern,
  parent) {
  return this.wsBefore +
    '[' +
    unparseChildren(this, this.separators, ', ')(this.elements) +
    this.wsBeforeClosing +
    ']' +
    this.wsAfter;
}

/* tslint:disable:max-classes-per-file */
/* type alias UnparseElement =
     ({name: string, map?: (typeof this[name], (Node, ParentNode?) => string, Node, ParentNode?)  => UnparseElement} | string);
   type alias UnparseArray = UnparseElement[] */
export class ArrayExpression {
    type: string;
    elements: ArrayExpressionElement[];
    wsBefore: string;
    wsBeforeClosing: string;
    separators: string[];
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return unparseArray.bind(this)(parent);
    }
    constructor(wsBefore: string, elements: ArrayExpressionElement[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ArrayExpression;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
        this.separators = separators;
    }
}

export class ArrayPattern {
    type: string;
    elements: ArrayPatternElement[];
    wsBefore: string;
    wsBeforeClosing: string;
    separators: string[];
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return unparseArray.bind(this)(parent);
    }
    constructor(wsBefore: string, elements: ArrayPatternElement[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ArrayPattern;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
        this.separators = separators;
    }
}

const arrowFunctionUnparser = function(this: ArrowFunctionExpression | AsyncArrowFunctionExpression, parent) {
  return this.wsBefore +
    (this.async ? this.wsBeforeAsync + 'async' : '') +
    this.wsBeforeOpening +
    (this.params.length === 1 && this.noparens ? '' : '(') +
    unparseChildren(this, this.separators, ', ')(this.params) +
    this.wsBeforeClosing +
    (this.params.length === 1 && this.noparens ? '' : ')') +
    this.wsBeforeArrow +
    this.arrow +
    unparseChild(this)(this.body) +
    this.wsAfter;
};
export class ArrowFunctionExpression {
    type: string;
    id: Identifier | null;
    params: FunctionParameter[];
    body: BlockStatement | Expression;
    generator: boolean;
    expression: boolean;
    async: boolean;
    noparens: boolean;
    wsBefore: string = '';
    wsBeforeAsync: string = '';
    wsBeforeOpening: string;
    separators: string[];
    wsBeforeClosing: string;
    wsBeforeArrow: string;
    arrow: string = '=>';
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return arrowFunctionUnparser.bind(this)(parent);
    }
    constructor(wsBeforeOpening: string, params: FunctionParameter[], separators: string[], wsBeforeClosing: string, noparens: boolean, wsBeforeArrow: string, body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = false;
        this.wsBeforeOpening = wsBeforeOpening;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeArrow = wsBeforeArrow;
        this.noparens = noparens;
    }
}

function binaryUnparser(this: AssignmentExpression | BinaryExpression | AssignmentPattern, parent: any) {
  return this.wsBefore +
    unparseChild(this)(this.left) +
    this.wsBeforeOp +
    (isAssignmentPattern(this) ? '=' : this.operator) +
    unparseChild(this)(this.right) +
    this.wsAfter;
}
export class AssignmentExpression {
    type: string;
    operator: string;
    left: Expression;
    right: Expression;
    wsBefore: string = '';
    wsBeforeOp: string;
    wsAfter: string = '';
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
    type: string;
    left: BindingIdentifier | BindingPattern;
    right: Expression;
    wsBefore: string = '';
    wsBeforeOp: string;
    wsAfter: string = '';
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
    type: string;
    id: Identifier | null;
    params: FunctionParameter[];
    body: BlockStatement | Expression;
    generator: boolean;
    expression: boolean;
    async: boolean;
    noparens: boolean;
    wsBefore: string = '';
    wsBeforeAsync: string;
    wsBeforeOpening: string;
    separators: string[];
    wsBeforeClosing: string;
    wsBeforeArrow: string;
    arrow: string = '=>';
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return arrowFunctionUnparser.bind(this)(parent);
    }
    constructor(wsBeforeAsync: string, wsBeforeOpening: string, params: FunctionParameter[], separators: string[], wsBeforeClosing: string, noparens: boolean, wsBeforeArrow: string, body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = true;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeArrow = wsBeforeArrow;
        this.noparens = noparens;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeAsync = wsBeforeAsync;
    }
}

export type AnyFunctionExpression = AsyncFunctionDeclaration | FunctionDeclaration |
AsyncFunctionExpression | FunctionExpression;
// Context-sensitive unparsing definition.
// If a method, the async and generator (*) are already managed, and the word "function" does not appear.
const functionDeclarationUnparser = function(this: AnyFunctionExpression, parent) {
  const isFunctionMethod = parent && (parent.type === Syntax.Property && (parent.method || parent.kind === 'get' || parent.kind === 'set') || parent.type === Syntax.MethodDefinition);
  return this.wsBefore +
    (isFunctionMethod ? '' :
    this.async ? this.wsBeforeAsync + 'async' : '') +
    this.wsBeforeFunction +
    (isFunctionMethod ? '' : 'function' +
      (this.generator ? this.wsBeforeStar + '*' : '')
    ) +
    unparseChild(this)(this.id) +
    this.wsBeforeParams +
    '(' +
    unparseChildren(this, this.separators, ', ')(this.params) +
    this.wsBeforeEndParams +
    ')' +
    unparseChild(this)(this.body) +
    this.wsAfter;
};
export class AsyncFunctionDeclaration {
    type: string;
    id: Identifier | null;
    params: FunctionParameter[];
    body: BlockStatement;
    generator: boolean;
    expression: boolean;
    async: boolean;
    wsBefore: string = '';
    wsBeforeAsync: string;
    wsBeforeFunction: string;
    wsBeforeStar: string;
    wsBeforeParams: string;
    separators: string[];
    wsBeforeEndParams: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBeforeAsync: string, wsBeforeFunction: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
        this.wsBeforeFunction = wsBeforeFunction;
        this.wsBeforeAsync = wsBeforeAsync;
        this.wsBeforeStar = '';
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
    }
}

export class AsyncFunctionExpression {
    type: string;
    id: Identifier | null;
    params: FunctionParameter[];
    body: BlockStatement;
    generator: boolean;
    expression: boolean;
    async: boolean;
    wsBefore: string = '';
    wsBeforeAsync: string;
    wsBeforeFunction: string;
    wsBeforeStar: string;
    wsBeforeParams: string;
    separators: string[];
    wsBeforeEndParams: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBeforeAsync: string, wsBeforeFunction: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
        this.wsBeforeFunction = wsBeforeFunction;
        this.wsBeforeAsync = wsBeforeAsync;
        this.wsBeforeStar = '';
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
    }
}

export class AwaitExpression {
    type: string;
    argument: Expression;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'await' +
        unparseChild(this)(this.argument) + this.wsAfter;
    }
    constructor(wsBefore: string, argument: Expression) {
        this.type = Syntax.AwaitExpression;
        this.argument = argument;
        this.wsBefore = wsBefore;
    }
}

export class BinaryExpression {
    type: string;
    operator: string;
    left: Expression;
    right: Expression;
    wsBefore: string = '';
    wsBeforeOp: string;
    wsAfter: string = '';
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
    type: string;
    body: StatementListItem[];
    wsBefore: string;
    wsBeforeEnd: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        '{' +
        unparseChildren(this)(this.body) +
        this.wsBeforeEnd +
        '}' +
        this.wsAfter;
    }
    constructor(wsBefore: string, body: StatementListItem[], wsBeforeEnd: string) {
        this.type = Syntax.BlockStatement;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeEnd = wsBeforeEnd;
    }
}

const controlLabelStatementUnparseData = function(this: BreakStatement | ContinueStatement, parent, name) {
  return this.wsBefore +
    name +
    unparseChild(this)(this.label) +
    this.semicolon +
    this.wsAfter;
};
export class BreakStatement {
    type: string;
    label: Identifier | null;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return controlLabelStatementUnparseData.bind(this)(parent, 'break');
    }
    constructor(wsBefore: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.BreakStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class CallExpression {
    type: string;
    callee: Expression | Import;
    arguments: ArgumentListElement[];
    wsBefore: string = '';
    wsBeforeArgs: string;
    separators: string[];
    wsBeforeEndArgs: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.callee) +
        this.wsBeforeArgs +
        '(' +
        unparseChildren(this, this.separators, ', ')(this.arguments) +
        this.wsBeforeEndArgs +
        ')' +
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
    type: string;
    param: BindingIdentifier | BindingPattern;
    body: BlockStatement;
    wsBefore: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        'catch' +
        this.wsBeforeOpening +
        '(' +
        unparseChild(this)(this.param) +
        this.wsBeforeClosing +
        ')' +
        unparseChild(this)(this.body) +
        this.wsAfter;
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
    type: string;
    body: Property[];
    wsBefore: string = '';
    wsBeforeOpening: string;
    wsAfterOpening: string;
    wsBeforeClosing: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
       this.wsBeforeOpening +
       '{' +
       this.wsAfterOpening +
       unparseChildren(this)(this.body) +
       this.wsBeforeClosing +
       '}' +
       this.wsAfter;
    }
    constructor(wsBeforeOpening: string, wsAfterOpening: string, body: Property[], wsBeforeClosing: string) {
        this.type = Syntax.ClassBody;
        this.body = body;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsAfterOpening = wsAfterOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
const classDeclarationUnparser = function(this: ClassDeclaration | ClassExpression, parent) {
  return this.wsBefore +
        'class' +
        unparseChild(this)(this.id) +
        (this.superClass ? this.wsBeforeExtends + 'extends' +
        unparseChild(this)(this.superClass) : '') +
        unparseChild(this)(this.body) +
        this.wsAfter;
};
export class ClassDeclaration {
    type: string;
    id: Identifier | null;
    superClass: Identifier | null;
    body: ClassBody;
    wsBefore: string;
    wsBeforeExtends: string;
    wsAfter: string = '';
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
    type: string;
    id: Identifier | null;
    superClass: Identifier | null;
    body: ClassBody;
    wsBefore: string;
    wsBeforeExtends: string;
    wsAfter: string = '';
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
    type: string;
    computed: boolean;
    object: Expression;
    property: Expression;
    wsBefore: string = '';
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsAfter: string = '';
    unparse() {
      return this.wsBefore +
        unparseChild(this)(this.object) +
        this.wsBeforeOpening +
        (this.computed ? '[' : '.') +
        unparseChild(this)(this.property) +
        this.wsBeforeClosing +
        (this.computed ? ']' : '') +
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
    type: string;
    test: Expression;
    consequent: Expression;
    alternate: Expression;
    wsBefore: string = '';
    wsBeforeQues: string;
    wsBeforeColon: string;
    wsAfter: string = '';
    unparse() {
      return this.wsBefore +
        unparseChild(this)(this.test) +
        this.wsBeforeQues +
        '?' +
        unparseChild(this)(this.consequent) +
        this.wsBeforeColon +
        ':' +
        unparseChild(this)(this.alternate) +
        this.wsAfter;
    }
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
    type: string;
    label: Identifier | null;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return controlLabelStatementUnparseData.bind(this)(parent, 'continue');
    }
    constructor(wsBefore: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.ContinueStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
export class DebuggerStatement {
    type: string;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        'debugger' +
        this.semicolon;
    }
    constructor(wsBefore: string, semicolon: string) {
        this.type = Syntax.DebuggerStatement;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class Directive {
    type: string;
    expression: Expression;
    directive: string;
    wsBefore: string = '';
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.expression) +
        this.semicolon +
        this.wsAfter;
    }
    constructor(expression: Expression, directive: string, semicolon: string) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
        this.directive = directive;
        this.semicolon = semicolon;
    }
}

export class DoWhileStatement {
    type: string;
    body: Statement;
    test: Expression;
    wsBefore: string;
    wsBeforeWhile: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    closingParens: string;
    semicolon: string;
    wsAfter: string = '';
    unparse() {
      return this.wsBefore +
       'do' +
       unparseChild(this)(this.body) +
       this.wsBeforeWhile +
       'while' +
       this.wsBeforeOpening +
       '(' +
       unparseChild(this)(this.test) +
       this.wsBeforeClosing +
       this.closingParens + this.semicolon +
       this.wsAfter;
    }
    constructor(wsBefore: string, body: Statement, wsBeforeWhile: string, wsBeforeOpening: string, test: Expression, wsBeforeClosing: string, semicolon: string, closingParens: string = ')') {
        this.type = Syntax.DoWhileStatement;
        this.body = body;
        this.test = test;
        this.wsBefore = wsBefore;
        this.wsBeforeWhile = wsBeforeWhile;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.closingParens = closingParens;
        this.semicolon = semicolon;
    }
}
export class EmptyStatement {
    type: string;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + this.semicolon + this.wsAfter;
    }
    constructor(wsBefore: string, semicolon: string = ';') {
        this.type = Syntax.EmptyStatement;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class ExportAllDeclaration {
    type: string;
    source: Literal;
    wsBefore: string;
    wsBeforeStar: string;
    wsBeforeFrom: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        'export' +
        this.wsBeforeStar +
        '*' +
        this.wsBeforeFrom +
        'from' +
        unparseChild(this)(this.source) +
        this.semicolon +
        this.wsAfter;
    }
    constructor(wsBefore: string, wsBeforeStar: string, wsBeforeFrom: string, source: Literal, semicolon: string = '') {
        this.type = Syntax.ExportAllDeclaration;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeFrom = wsBeforeFrom;
        this.source = source;
        this.semicolon = semicolon;
    }
}

export class ExportDefaultDeclaration {
    type: string;
    declaration: ExportableDefaultDeclaration;
    wsBefore: string;
    wsBeforeDefault: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        'export' +
        this.wsBeforeDefault +
        'default' +
        unparseChild(this)(this.declaration) +
        this.semicolon +
        this.wsAfter;
    }
    constructor(wsBefore: string, wsBeforeDefault: string, declaration: ExportableDefaultDeclaration, semicolon: string = '') {
        this.type = Syntax.ExportDefaultDeclaration;
        this.declaration = declaration;
        this.wsBefore = wsBefore;
        this.wsBeforeDefault = wsBeforeDefault;
        this.semicolon = semicolon;
    }
}

export class ExportNamedDeclaration {
    type: string;
    declaration: ExportableNamedDeclaration | null;
    specifiers: ExportSpecifier[];
    source: Literal | null;
    wsBefore: string;
    hasBrackets: boolean;
    wsBeforeOpening: string;
    separators: string[];
    wsBeforeClosing: string;
    wsBeforeFrom: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        'export' +
        (this.declaration ?
           unparseChild(this)(this.declaration) : '') +
        (this.specifiers.length || this.hasBrackets ?
          this.wsBeforeOpening + '{' + unparseChildren(this, this.separators, ',')(this.specifiers) + this.wsBeforeClosing + '}'
          : ''
        ) +
        (this.source ? this.wsBeforeFrom + 'from' + unparseChild(this)(this.source) : '') + this.semicolon + this.wsAfter;
    }
    constructor(wsBefore: string, declaration: ExportableNamedDeclaration | null,
                hasBrackets: boolean,
                wsBeforeOpening: string, specifiers: ExportSpecifier[], separators: string[], wsBeforeClosing: string,
                wsBeforeFrom: string, source: Literal | null, semicolon: string = '') {
        this.type = Syntax.ExportNamedDeclaration;
        this.declaration = declaration;
        this.specifiers = specifiers;
        this.source = source;
        this.wsBefore = wsBefore;
        this.hasBrackets = hasBrackets;
        this.wsBeforeOpening = wsBeforeOpening;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeFrom = wsBeforeFrom;
        this.semicolon = semicolon;
    }
}
export class ExportSpecifier {
    type: string;
    exported: Identifier;
    local: Identifier;
    noAs: boolean;
    wsBefore: string = '';
    wsBeforeAs: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      const localStr = unparseChild(this)(this.local);
      const exportedStr = unparseChild(this)(this.exported);
      return this.wsBefore +
        localStr +
        (this.noAs && localStr === exportedStr ?
            ''
          : this.wsBeforeAs + 'as' + unparseChild(this)(this.exported)) +
        this.wsAfter;
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
    type: string;
    expression: Expression;
    semicolon: string;
    wsBefore: string = '';
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.expression) + this.semicolon +
        this.wsAfter;
    }
    constructor(expression: Expression, semicolon: string) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
        this.semicolon = semicolon;
    }
}
const forCollectionUnparser = function(this: ForInStatement | ForOfStatement, parent, keyword) {
  return this.wsBefore +
    this.wsBeforeFor + 'for' + this.wsBeforeOpening + '(' +
    unparseChild(this)(this.left) +
    this.wsBeforeKeyword + keyword +
    unparseChild(this)(this.right) +
    this.wsBeforeClosing + this.closingParens +
    unparseChild(this)(this.body) +
    this.wsAfter;
};
export class ForInStatement {
    type: string;
    left: Expression;
    right: Expression;
    body: Statement;
    each: boolean;
    wsBefore: string = '';
    wsBeforeFor: string;
    wsBeforeOpening: string;
    wsBeforeKeyword: string;
    wsBeforeClosing: string;
    closingParens: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return forCollectionUnparser.bind(this)(parent, 'in');
    }
    constructor(wsBeforeFor: string, wsBeforeOpening: string,
                left: Expression, wsBeforeKeyword: string, right: Expression, wsBeforeClosing: string, body: Statement, closingParens: string = ')') {
        this.type = Syntax.ForInStatement;
        this.left = left;
        this.right = right;
        this.body = body;
        this.each = false;
        this.wsBeforeFor = wsBeforeFor;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeKeyword = wsBeforeKeyword;
        this.wsBeforeClosing = wsBeforeClosing;
        this.closingParens = closingParens;
    }
}

export class ForOfStatement {
    type: string;
    left: Expression;
    right: Expression;
    body: Statement;
    wsBefore: string = '';
    wsBeforeFor: string;
    wsBeforeOpening: string;
    wsBeforeKeyword: string;
    wsBeforeClosing: string;
    closingParens: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return forCollectionUnparser.bind(this)(parent, 'of');
    }
    constructor(wsBeforeFor: string, wsBeforeOpening: string,
                left: Expression, wsBeforeKeyword: string, right: Expression, wsBeforeClosing: string, body: Statement, closingParens: string = ')') {
        this.type = Syntax.ForOfStatement;
        this.left = left;
        this.right = right;
        this.body = body;
        this.wsBeforeFor = wsBeforeFor;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeKeyword = wsBeforeKeyword;
        this.wsBeforeClosing = wsBeforeClosing;
        this.closingParens = closingParens;
    }
}

export class ForStatement {
    type: string;
    init: Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
    wsBefore: string = '';
    wsBeforeFor: string;
    wsBeforeOpening: string;
    wsBeforeSemicolon1: string;
    wsBeforeSemicolon2: string;
    wsBeforeClosing: string;
    closingParens: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        this.wsBeforeFor + 'for' + this.wsBeforeOpening + '(' +
        unparseChild(this)(this.init) +
        this.wsBeforeSemicolon1 + ';' +
        unparseChild(this)(this.test) +
        this.wsBeforeSemicolon2 + ';' +
        unparseChild(this)(this.update) +
        this.wsBeforeClosing + this.closingParens +
        unparseChild(this)(this.body) +
        this.wsAfter;
    }
    constructor(wsBeforeFor: string, wsBeforeOpening: string, init: Expression | null, wsBeforeSemicolon1: string, test: Expression | null, wsBeforeSemicolon2: string, update: Expression | null, wsBeforeClosing: string, body: Statement, closingParens: string = ')') {
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
        this.closingParens = closingParens;
    }
}

export class FunctionDeclaration {
    type: string;
    id: Identifier | null;
    params: FunctionParameter[];
    body: BlockStatement;
    generator: boolean;
    expression: boolean;
    async: boolean;
    wsBefore: string = '';
    wsBeforeAsync: string = '';
    wsBeforeFunction: string;
    wsBeforeStar: string;
    wsBeforeParams: string;
    separators: string[];
    wsBeforeEndParams: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBeforeFunction: string, wsBeforeStar: string, id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
        this.wsBeforeFunction = wsBeforeFunction;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
    }
}
export class FunctionExpression {
    type: string;
    id: Identifier | null;
    params: FunctionParameter[];
    body: BlockStatement;
    generator: boolean;
    expression: boolean;
    async: boolean;
    wsBefore: string = '';
    wsBeforeAsync: string = '';
    wsBeforeFunction: string;
    wsBeforeStar: string;
    wsBeforeParams: string;
    separators: string[];
    wsBeforeEndParams: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return functionDeclarationUnparser.bind(this)(parent);
    }
    constructor(wsBeforeFunction: string, wsBeforeStar: string,
                id: Identifier | null, wsBeforeParams: string, params: FunctionParameter[], separators: string[], wsBeforeEndParams: string, body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
        this.wsBeforeFunction = wsBeforeFunction;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeParams = wsBeforeParams;
        this.separators = separators;
        this.wsBeforeEndParams = wsBeforeEndParams;
    }
}

export class Identifier {
    type: string;
    name: string; // can be modified
    original: string;
    nameRaw: string;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + (this.name === this.original ? this.nameRaw : this.name) + this.wsAfter;
    }
    constructor(wsBefore: string, name: string, nameRaw: string) {
        this.type = Syntax.Identifier;
        this.name = name;
        this.original = name;
        this.nameRaw = nameRaw;
        this.wsBefore = wsBefore;
    }
}
export class IfStatement {
    type: string;
    ifKeyword: string;
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
    wsBefore: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    closingParens: string;
    wsBeforeElse: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + this.ifKeyword +
        this.wsBeforeOpening + '(' +
        unparseChild(this)(this.test) +
        this.wsBeforeClosing + this.closingParens +
        unparseChild(this)(this.consequent) +
        (this.alternate ?
           this.wsBeforeElse + 'else' + unparseChild(this)(this.alternate) : '') +
        this.wsAfter;
    }
    constructor(wsBefore: string, ifKeyword: string, wsBeforeOpening: string, test: Expression,
                wsBeforeClosing: string, consequent: Statement, wsBeforeElse: string, alternate: Statement | null, closingParens: string = ')') {
        this.type = Syntax.IfStatement;
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.ifKeyword = ifKeyword;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeElse = wsBeforeElse;
        this.closingParens = closingParens;
    }
}

export class Import {
    type: string;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'import' + this.wsAfter;
    }
    constructor(wsBefore) {
        this.type = Syntax.Import;
        this.wsBefore = wsBefore;
    }
}

export class ImportDeclaration {
    type: string;
    // At most one default specifier
    // Followed by one ImportNamespaceSpecifier or many {ImportSpecifier}
    specifiers: ImportDeclarationSpecifier[];
    source: Literal;
    wsBefore: string;
    hasBrackets: boolean;
    separators: string[];
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsBeforeFrom: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      let result = this.wsBefore + 'import';
      if (this.specifiers.length === 0 && !this.hasBrackets) {
        return result + unparseChild(this)(this.source) + this.semicolon + this.wsAfter;
      }
      let insideImportSpecifiers = false;
      for (let i = 0; i < this.specifiers.length; i++) {
        const specifier = this.specifiers[i];
        if (specifier.type === Syntax.ImportSpecifier) {
          if (!insideImportSpecifiers) {
            result += this.wsBeforeOpening + '{';
            insideImportSpecifiers = true;
          }
        }
        result += unparseChild(this)(specifier);
        if (i < this.separators.length) {
          result += this.separators[i];
        } else if (i < this.specifiers.length - 1) {
          result += ', ';
        }
      }
      if (!insideImportSpecifiers && this.hasBrackets) {
        result += this.wsBeforeOpening + '{';
        insideImportSpecifiers = true;
      }
      if (insideImportSpecifiers) {
        result += this.wsBeforeClosing + '}';
      }
      return result + this.wsBeforeFrom + 'from' +
         unparseChild(this)(this.source) + this.semicolon + this.wsAfter;
    }
    constructor(wsBefore: string, wsBeforeOpening: string, hasBrackets: boolean, specifiers: ImportDeclarationSpecifier[], separators: string[], wsBeforeClosing: string, wsBeforeFrom: string, source, semicolon: string = '') {
        this.type = Syntax.ImportDeclaration;
        this.hasBrackets = hasBrackets;
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
    type: string;
    local: Identifier;
    wsBefore: string = '';
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + unparseChild(this)(this.local) + this.wsAfter;
    }
    constructor(local: Identifier) {
        this.type = Syntax.ImportDefaultSpecifier;
        this.local = local;
    }
}
export class ImportNamespaceSpecifier {
    type: string;
    local: Identifier;
    wsBefore: string;
    wsBeforeAs: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + '*' + this.wsBeforeAs + 'as' +
        unparseChild(this)(this.local) + this.wsAfter;
    }
    constructor(wsBefore: string, wsBeforeAs: string, local: Identifier) {
        this.type = Syntax.ImportNamespaceSpecifier;
        this.wsBefore = wsBefore;
        this.wsBeforeAs = wsBeforeAs;
        this.local = local;
    }
}

export class ImportSpecifier {
    type: string;
    local: Identifier;
    imported: Identifier;
    asPresent: boolean;
    wsBefore: string = '';
    wsBeforeAs: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.imported) +
        (this.asPresent ? this.wsBeforeAs + 'as' +
        unparseChild(this)(this.local) : '') + this.wsAfter;
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
    type: string;
    label: Identifier;
    body: Statement | ClassDeclaration;
    wsBefore: string = '';
    wsBeforeColon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.label) +
        this.wsBeforeColon + ':' +
        unparseChild(this)(this.body) +
        this.wsAfter;
    }
    constructor(label: Identifier, wsBeforeColon: string, body: Statement | ClassDeclaration) {
        this.type = Syntax.LabeledStatement;
        this.label = label;
        this.body = body;
        this.wsBeforeColon = wsBeforeColon;
    }
}
function unescapeChar(m) {
  switch (m) {
    case '\\': return '\\\\';
    case '\b': return '\\b';
    case '\f': return '\\f';
    case '\n': return '\\n';
    case '\r': return '\\r';
    case '\t': return '\\t';
    case '\v': return '\\v';
    default: return m;
  }
}
function unescapeCharSequence(str: string): string {
  return str.replace(/[\\\b\f\n\r\t\v]/g, unescapeChar);
}

export function uneval(x: any): string {
  if (typeof x === 'string') {
    return toExpString(x);
  }
  if (typeof x === 'number' || typeof x === 'boolean') {
    return '' + x;
  }
  if (typeof x === 'object' && x === null) {
    return 'null';
  }
  if (typeof x === 'object' && typeof x.length === 'number') { // Arrays
    const result: string[] = [];
    x = x as any[];
    for (let i = 0; i < x.length; i++) {
      result.push(uneval(x[i]));
    }
    return '[' + result.join(',') + ']';
  }
  if (typeof x === 'object') {
    const result: string[] = [];
    for (const k of Object.keys(x)) {
      result.push(k + ':' + uneval(x[k]));
    }
    return '{' + result.join(', ') + '}';
  }
  return '' + x;
}
function toExpString(str, raw?) {
  const charDelim = raw && raw.length >= 1 && (raw[0] === '"' || raw[0] === '`' || raw[0] === '\'') ? raw[0] : '"';
  return charDelim + unescapeCharSequence(str).replace(charDelim, '\\' + charDelim) + charDelim;
}

export class Literal {
    type: string;
    value: boolean | number | string | null; // Can be modified
    raw: string;
    original: boolean | number | string | null;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        (this.original === this.value ? this.raw :
        typeof this.value === 'string' && typeof this.original === 'string' ?
            toExpString(this.value, this.raw) :
          typeof this.value === 'object' ?
            this.value === null ?
              'null' :
              uneval(this.value) :
          uneval(this.value)) + this.wsAfter;
    }
    constructor(wsBefore: string, value: boolean | number | string | null, raw: string) {
        this.type = Syntax.Literal;
        this.value = value;
        this.raw = raw;
        this.original = value;
        this.wsBefore = wsBefore;
    }
}

export class MetaProperty {
    type: string;
    meta: Identifier;
    property: Identifier;
    wsBefore: string = '';
    wsBeforeDot: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.meta) +
        this.wsBeforeDot + '.' +
        unparseChild(this)(this.property) +
        this.wsAfter;
    }
    constructor(meta: Identifier, wsBeforeDot: string, property: Identifier) {
        this.type = Syntax.MetaProperty;
        this.meta = meta;
        this.property = property;
        this.wsBeforeDot = wsBeforeDot;
    }
}

export class MethodDefinition {
    type: string;
    key: Expression;
    computed: boolean;
    value: AsyncFunctionExpression | FunctionExpression | null;
    kind: 'init' | 'method' | 'constructor' | 'set' | 'get';
    static: boolean;
    wsBefore: string = '';
    wsBeforeGetSet: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsBeforeStatic: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      const keyStr = unparseChild(this)(this.key);
      return this.wsBefore +
        (this.static ? this.wsBeforeStatic + 'static' : '') +
        (this.value && isFunctionExpression(this.value) ?
          (this.value.async ? this.value.wsBeforeAsync + 'async' : '') +
          (this.value.generator ? this.value.wsBeforeStar + '*' : '') : '') +
        (this.kind === 'set' || this.kind === 'get' ? this.wsBeforeGetSet + this.kind : '') +
        (this.computed ? this.wsBeforeOpening + '[' : '') +
        keyStr +
        (this.computed ? this.wsBeforeClosing + ']' : '') +
        unparseChild(this)(this.value) +
        this.wsAfter;
    }
    constructor(wsBeforeStatic: string, wsBeforeGetSet, key: Expression, computed: boolean, wsBeforeOpening: string, wsBeforeClosing: string, value: AsyncFunctionExpression | FunctionExpression | null, kind: 'init' | 'method' | 'constructor' | 'set' | 'get', isStatic: boolean) {
        this.type = Syntax.MethodDefinition;
        this.key = key;
        this.computed = computed;
        this.value = value;
        this.kind = kind;
        this.static = isStatic;
        this.wsBeforeGetSet = wsBeforeGetSet;
        this.wsBeforeStatic = wsBeforeStatic;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class Module {
    type: string;
    body: StatementListItem[];
    sourceType: string;
    wsBefore: string = '';
    wsAfter: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + unparseChildren(this)(this.body) + this.wsAfter;
    }
    constructor(body: StatementListItem[], wsAfter: string) {
        this.type = Syntax.Program;
        this.body = body;
        this.sourceType = 'module';
        this.wsAfter = wsAfter;
    }
}

export class NewExpression {
    type: string;
    callee: Expression;
    arguments: ArgumentListElement[];
    wsBefore: string = '';
    wsBeforeNew: string;
    parentheses: boolean;
    wsBeforeOpening: string;
    separators: string[];
    wsBeforeClosing: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        this.wsBeforeNew + 'new' +
        unparseChild(this)(this.callee) +
        (this.parentheses || this.arguments.length > 0 ?
          this.wsBeforeOpening + '(' +
          unparseChildren(this, this.separators, ', ')(this.arguments) +
          this.wsBeforeClosing + ')'
        : '') +
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
const objectExpressionPatternUnparse = function(this: ObjectExpression | ObjectPattern) {
  return this.wsBefore + '{' +
    unparseChildren(this, this.separators, ', ')(this.properties) +
    this.wsBeforeClosing + '}'  + this.wsAfter;
};
export class ObjectExpression {
    type: string;
    properties: ObjectExpressionProperty[];
    wsBefore: string;
    wsBeforeClosing: string;
    separators: string[];
    wsAfter: string = '';
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
    type: string;
    properties: ObjectPatternProperty[];
    wsBefore: string;
    separators: string[];
    wsBeforeClosing: string;
    wsAfter: string = '';
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
function isAssignmentPattern(e: any): e is AssignmentPattern {
  return e.type === Syntax.AssignmentPattern;
}
export class Property {
    type: string;
    key: PropertyKey;
    computed: boolean;
    value: PropertyValue | null;
    kind: 'init' | 'get' | 'set';
    method: boolean;
    shorthand: boolean;
    wsBefore: string = '';
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsBeforeGetSet: string;
    wsBeforeColon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      const ap = this.value && isAssignmentPattern(this.value);
      return this.wsBefore + (this.method && this.value ?
        isFunctionExpression(this.value) ?
          (this.value.async ? this.value.wsBeforeAsync + 'async' : '') +
          (this.value.generator ? this.value.wsBeforeStar + '*' : '') : ''
      : '') +
        (this.kind === 'get' || this.kind === 'set' ? this.wsBeforeGetSet + this.kind : '') +
        (!this.shorthand || (this.value && !ap) ? (this.computed ? this.wsBeforeOpening + '[' : '') + unparseChild(this)(this.key) + (this.computed ? this.wsBeforeClosing + ']' : '')  : '') +
        (this.method || this.shorthand || this.kind === 'get' || this.kind === 'set' ? '' : this.wsBeforeColon + ':') +
        (this.shorthand && !ap ? '' : unparseChild(this)(this.value)) + this.wsAfter;
    }
    constructor(kind: 'init' | 'get' | 'set', key: PropertyKey, wsBeforeGetSet: string, wsBeforeOpening: string, wsBeforeClosing: string, wsBeforeColon: string, computed: boolean, value: PropertyValue | null, method: boolean, shorthand: boolean) {
        this.type = Syntax.Property;
        this.key = key;
        this.computed = computed;
        this.value = value;
        this.kind = kind;
        this.method = method;
        this.shorthand = shorthand;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.wsBeforeGetSet = wsBeforeGetSet;
        this.wsBeforeColon = wsBeforeColon;
    }
}

export class RegexLiteral {
    type: string;
    value: RegExp;
    raw: string;
    regex: { pattern: string, flags: string };
    original: { pattern: string, flags: string };
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        (this.original.pattern === this.regex.pattern &&
         this.original.flags === this.regex.flags ? this.raw :
        '/' +
        this.regex.pattern +
        '/' +
        this.regex.flags) + this.wsAfter;
    }
    constructor(wsBefore: string, value: RegExp, raw: string, pattern: string, flags: string) {
        this.type = Syntax.Literal;
        this.value = value;
        this.raw = raw;
        this.regex = { pattern, flags };
        this.original = { pattern, flags };
        this.wsBefore = wsBefore;
    }
}

export class RestElement {
    type: string;
    argument: BindingIdentifier | BindingPattern;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + '...' +
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
    type: string;
    argument: Expression | null;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'return' +
        unparseChild(this)(this.argument) +
        this.semicolon + this.wsAfter;
    }
    constructor(wsBefore: string, argument: Expression | null, semicolon: string) {
        this.type = Syntax.ReturnStatement;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class Script {
    type: string;
    body: StatementListItem[];
    sourceType: string;
    wsBefore: string = '';
    wsAfter: string;
    unparse(parent?: Unparsable): string {
      return this.wsBefore + unparseChildren(this)(this.body) +
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
    type: string;
    expressions: Expression[];
    wsBefore: string = '';
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    parentheses: boolean;
    separators: string[];
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        (this.parentheses ? this.wsBeforeOpening + '(' : '') +
        unparseChildren(this, this.separators, ', ')(this.expressions) +
        (this.parentheses ? this.wsBeforeClosing + ')' : '') +
        this.wsAfter;
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
    type: string;
    argument: Expression;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + '...' +
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
    type: string;
    computed: boolean;
    object: Expression;
    property: Expression;
    wsBefore: string = '';
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsAfter: string = '';
    unparse() {
      return this.wsBefore +
        unparseChild(this)(this.object) +
        this.wsBeforeOpening +
        (this.computed ? '[' : '.') +
        unparseChild(this)(this.property) +
        this.wsBeforeClosing +
        (this.computed ? ']' : '') +
        this.wsAfter;
    }
    constructor(object: Expression, wsBeforeOpening: string, property: Expression) {
        this.type = Syntax.MemberExpression;
        this.computed = false;
        this.object = object;
        this.property = property;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = '';
    }
}

export class Super {
    type: string;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'super' + this.wsAfter;
    }
    constructor(wsBefore: string) {
        this.type = Syntax.Super;
        this.wsBefore = wsBefore;
    }
}

export class SwitchCase {
    type: string;
    test: Expression | null;
    consequent: StatementListItem[];
    wsBefore: string;
    wsBeforeColon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + (this.test ? 'case' + unparseChild(this)(this.test) : 'default') +
        this.wsBeforeColon + ':' +
        unparseChildren(this)(this.consequent) + this.wsAfter;
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
    type: string;
    discriminant: Expression;
    cases: SwitchCase[];
    wsBefore: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsBeforeBlockOpening: string;
    wsBeforeBlockClosing: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'switch' + this.wsBeforeOpening +
        '(' + unparseChild(this)(this.discriminant) + this.wsBeforeClosing +
        ')' + this.wsBeforeBlockOpening + '{' +
        unparseChildren(this)(this.cases) +
        this.wsBeforeBlockClosing + '}' + this.wsAfter;
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
    type: string;
    tag: Expression;
    quasi: TemplateLiteral;
    wsBefore: string = '';
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.tag) + unparseChild(this)(this.quasi) +
        this.wsAfter;
    }
    constructor(tag: Expression, quasi: TemplateLiteral) {
        this.type = Syntax.TaggedTemplateExpression;
        this.tag = tag;
        this.quasi = quasi;
    }
}

interface TemplateElementValue {
    cooked: string; // Can be modified.
    raw: string;
}

export class TemplateElement {
    type: string;
    value: TemplateElementValue;
    originalCooked: string;
    tail: boolean;
    wsBefore: string = ''; // Not much sense here, there is yet no kind of whitespace for template elements
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        (this.value.cooked === this.originalCooked ? this.value.raw :
          this.value.cooked.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')) +
        this.wsAfter;
    }
    constructor(value: TemplateElementValue, tail: boolean) {
        this.type = Syntax.TemplateElement;
        this.value = value;
        this.originalCooked = value.cooked;
        this.tail = tail;
    }
}

export class TemplateLiteral {
    type: string;
    quasis: TemplateElement[];
    expressions: Expression[];
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      let result = '';
      for (let i = 0; i < this.quasis.length; i++) {
        result += unparseChild(this)(this.quasis[i]) + (i < this.expressions.length ? '${' + unparseChild(this)(this.expressions[i]) + '}' : '');
      }
      return this.wsBefore + '`' + result + '`' + this.wsAfter;
    }
    constructor(wsBefore: string, quasis: TemplateElement[], expressions: Expression[]) {
        this.type = Syntax.TemplateLiteral;
        this.quasis = quasis;
        this.expressions = expressions;
        this.wsBefore = wsBefore;
    }
}

export class ThisExpression {
    type: string;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'this' + this.wsAfter;
    }
    constructor(wsBefore: string) {
        this.type = Syntax.ThisExpression;
        this.wsBefore = wsBefore;
    }
}

export class ThrowStatement {
    type: string;
    argument: Expression;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'throw' +
        unparseChild(this)(this.argument) + this.semicolon +
        this.wsAfter;
    }
    constructor(wsBefore: string, argument: Expression, semicolon: string) {
        this.type = Syntax.ThrowStatement;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}

export class TryStatement {
    type: string;
    block: BlockStatement;
    handler: CatchClause | null;
    finalizer: BlockStatement | null;
    wsBefore: string;
    wsBeforeFinally: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'try' +
        unparseChild(this)(this.block) +
        unparseChild(this)(this.handler) +
        (this.finalizer ? this.wsBeforeFinally + 'finally' + unparseChild(this)(this.finalizer) : '') +
        this.wsAfter;
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
    type: string;
    operator: string;
    argument: Expression;
    prefix: boolean;
    wsBefore: string;
    wsAfter: string = '';
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
    type: string;
    operator: string;
    argument: Expression;
    prefix: boolean;
    wsBefore: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return (this.prefix ? this.wsBefore + this.operator : '') +
        unparseChild(this)(this.argument) +
        (this.prefix ? '' : this.wsBefore + this.operator) +
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
    type: string;
    declarations: VariableDeclarator[];
    kind: string;
    wsBefore: string;
    separators: string[];
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + this.kind + unparseChildren(this, this.separators, ', ')(this.declarations) +
        this.semicolon + this.wsAfter;
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
    type: string;
    id: BindingIdentifier | BindingPattern;
    init: Expression | null;
    wsBefore: string = '';
    wsBeforeEq: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore +
        unparseChild(this)(this.id) +
        (this.init ? this.wsBeforeEq + '=' + unparseChild(this)(this.init) : '') +
        this.wsAfter;
    }
    constructor(id: BindingIdentifier | BindingPattern, wsBeforeEq: string, init: Expression | null) {
        this.type = Syntax.VariableDeclarator;
        this.id = id;
        this.wsBeforeEq = wsBeforeEq;
        this.init = init;
    }
}

export class WhileStatement {
    type: string;
    test: Expression;
    body: Statement;
    wsBefore: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    closingParens: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'while' + this.wsBeforeOpening +
        '(' + unparseChild(this)(this.test) + this.wsBeforeClosing + this.closingParens +
        unparseChild(this)(this.body) +
        this.wsAfter;
    }
    constructor(wsBefore: string, wsBeforeOpening: string, test: Expression, wsBeforeClosing: string, body: Statement, closingParens: string = ')') {
        this.type = Syntax.WhileStatement;
        this.test = test;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
        this.closingParens = closingParens;
    }
}

export class WithStatement {
    type: string;
    object: Expression;
    body: Statement;
    wsBefore: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    closingParens: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'with' + this.wsBeforeOpening + '(' +
        unparseChild(this)(this.object) + this.wsBeforeClosing + this.closingParens +
        unparseChild(this)(this.body) +
        this.wsAfter;
    }
    constructor(wsBefore: string, wsBeforeOpening: string, object: Expression, wsBeforeClosing: string, body: Statement, closingParens: string = ')') {
        this.type = Syntax.WithStatement;
        this.object = object;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.closingParens = closingParens;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class YieldExpression {
    type: string;
    argument: Expression | null;
    delegate: boolean;
    wsBefore: string;
    wsBeforeStar: string;
    semicolon: string;
    wsAfter: string = '';
    unparse(parent?: Unparsable): string {
      return this.wsBefore + 'yield' + (this.delegate ? this.wsBeforeStar + '*' : '') +
        (this.argument ? unparseChild(this)(this.argument) : '') + this.semicolon + this.wsAfter;
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
