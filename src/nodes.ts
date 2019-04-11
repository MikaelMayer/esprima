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
  type: string;
  wsAfter: string;
}
export type UnparsableOrNull = Unparsable | null;
export let unparseChildren = (parent: any = undefined,
                              join: string | string[] = '', defaultJoin = '') => (children: UnparsableOrNull[]) => {
  if (children) {
    const renderedChildren = children.map(child => unparse(child, parent));
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

export let unparseChild = (parent: any = undefined) => (node: UnparsableOrNull) =>  unparse(node, parent);

function unparseArray(
  e: ArrayExpression | ArrayPattern,
  parent) {
  return e.wsBefore +
    '[' +
    unparseChildren(e, e.separators, ', ')(e.elements) +
    e.wsBeforeClosing +
    ']' +
    e.wsAfter;
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
    constructor(wsBefore: string, elements: ArrayExpressionElement[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ArrayExpression;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
        this.separators = separators;
    }
}
var unparseArrayExpression = unparseArray;

export class ArrayPattern {
    type: string;
    elements: ArrayPatternElement[];
    wsBefore: string;
    wsBeforeClosing: string;
    separators: string[];
    wsAfter: string = '';
    constructor(wsBefore: string, elements: ArrayPatternElement[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ArrayPattern;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
        this.separators = separators;
    }
}
var unparseArrayPattern = unparseArray;

const arrowFunctionUnparser = function(e: ArrowFunctionExpression | AsyncArrowFunctionExpression, parent) {
  return e.wsBefore +
    (e.async ? e.wsBeforeAsync + 'async' : '') +
    e.wsBeforeOpening +
    (e.params.length === 1 && e.noparens ? '' : '(') +
    unparseChildren(e, e.separators, ', ')(e.params) +
    e.wsBeforeClosing +
    (e.params.length === 1 && e.noparens ? '' : ')') +
    e.wsBeforeArrow +
    e.arrow +
    unparseChild(e)(e.body) +
    e.wsAfter;
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
var unparseArrowFunctionExpression = arrowFunctionUnparser;

function binaryUnparser(e: AssignmentExpression | BinaryExpression | AssignmentPattern, parent: any) {
  return e.wsBefore +
    unparseChild(e)(e.left) +
    e.wsBeforeOp +
    (isAssignmentPattern(e) ? '=' : e.operator) +
    unparseChild(e)(e.right) +
    e.wsAfter;
}
export class AssignmentExpression {
    type: string;
    operator: string;
    left: Expression;
    right: Expression;
    wsBefore: string = '';
    wsBeforeOp: string;
    wsAfter: string = '';
    constructor(wsBeforeOp: string, operator: string, left: Expression, right: Expression) {
        this.type = Syntax.AssignmentExpression;
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.wsBeforeOp = wsBeforeOp;
    }
}
var unparseAssignmentExpression = binaryUnparser;

export class AssignmentPattern {
    type: string;
    left: BindingIdentifier | BindingPattern;
    right: Expression;
    wsBefore: string = '';
    wsBeforeOp: string;
    wsAfter: string = '';
    constructor(left: BindingIdentifier | BindingPattern, wsBeforeOp: string, right: Expression) {
        this.type = Syntax.AssignmentPattern;
        this.left = left;
        this.right = right;
        this.wsBeforeOp = wsBeforeOp;
    }
}
var unparseAssignmentPattern = binaryUnparser;

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
var unparseArrowFunctionExpression = arrowFunctionUnparser;

export type AnyFunctionExpression = AsyncFunctionDeclaration | FunctionDeclaration |
AsyncFunctionExpression | FunctionExpression;
// Context-sensitive unparsing definition.
// If a method, the async and generator (*) are already managed, and the word "function" does not appear.
const functionDeclarationUnparser = function(e: AnyFunctionExpression, parent) {
  const isFunctionMethod = parent && (parent.type === Syntax.Property && (parent.method || parent.kind === 'get' || parent.kind === 'set') || parent.type === Syntax.MethodDefinition);
  return e.wsBefore +
    (isFunctionMethod ? '' :
    e.async ? e.wsBeforeAsync + 'async' : '') +
    e.wsBeforeFunction +
    (isFunctionMethod ? '' : 'function' +
      (e.generator ? e.wsBeforeStar + '*' : '')
    ) +
    unparseChild(e)(e.id) +
    e.wsBeforeParams +
    '(' +
    unparseChildren(e, e.separators, ', ')(e.params) +
    e.wsBeforeEndParams +
    ')' +
    unparseChild(e)(e.body) +
    e.wsAfter;
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
    constructor(wsBefore: string, argument: Expression) {
        this.type = Syntax.AwaitExpression;
        this.argument = argument;
        this.wsBefore = wsBefore;
    }
}
var unparseAwaitExpression = (e: AwaitExpression, parent) => 
  e.wsBefore + 'await' +
    unparseChild(e)(e.argument) + e.wsAfter;

export class BinaryExpression {
    type: string;
    operator: string;
    left: Expression;
    right: Expression;
    wsBefore: string = '';
    wsBeforeOp: string;
    wsAfter: string = '';
    constructor(operator: string, left: Expression, right: Expression, wsBeforeOp: string) {
        const logical = (operator === '||' || operator === '&&');
        this.type = logical ? Syntax.LogicalExpression : Syntax.BinaryExpression;
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.wsBeforeOp = wsBeforeOp;
    }
}
var unparseBinaryExpression = binaryUnparser;
var unparseLogicalExpression = binaryUnparser;

export class BlockStatement {
    type: string;
    body: StatementListItem[];
    wsBefore: string;
    wsBeforeEnd: string;
    wsAfter: string = '';
    constructor(wsBefore: string, body: StatementListItem[], wsBeforeEnd: string) {
        this.type = Syntax.BlockStatement;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeEnd = wsBeforeEnd;
    }
}
var unparseBlockStatement = (e: BlockStatement, parent?: Unparsable) =>
      e.wsBefore +
      '{' +
      unparseChildren(e)(e.body) +
      e.wsBeforeEnd +
      '}' +
      e.wsAfter;

const controlLabelStatementUnparseData = (name) => (e: BreakStatement | ContinueStatement, parent) => 
  e.wsBefore +
    name +
    unparseChild(e)(e.label) +
    e.semicolon +
    e.wsAfter;
export class BreakStatement {
    type: string;
    label: Identifier | null;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.BreakStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
var unparseBreakStatement = controlLabelStatementUnparseData("break");

export class CallExpression {
    type: string;
    callee: Expression | Import;
    arguments: ArgumentListElement[];
    wsBefore: string = '';
    wsBeforeArgs: string;
    separators: string[];
    wsBeforeEndArgs: string;
    wsAfter: string = '';
    constructor(callee: Expression | Import, wsBeforeArgs: string, args: ArgumentListElement[], separators: string[], wsBeforeEndArgs: string) {
        this.type = Syntax.CallExpression;
        this.callee = callee;
        this.arguments = args;
        this.wsBeforeArgs = wsBeforeArgs;
        this.separators = separators;
        this.wsBeforeEndArgs = wsBeforeEndArgs;
    }
}
var unparseCallExpression = (e: CallExpression, parent: Unparsable) =>
  e.wsBefore +
  unparseChild(e)(e.callee) +
  e.wsBeforeArgs +
  '(' +
  unparseChildren(e, e.separators, ', ')(e.arguments) +
  e.wsBeforeEndArgs +
  ')' +
  e.wsAfter;

export class CatchClause {
    type: string;
    param: BindingIdentifier | BindingPattern;
    body: BlockStatement;
    wsBefore: string;
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsAfter: string = '';
    constructor(wsBefore: string, wsBeforeOpening: string, param: BindingIdentifier | BindingPattern, wsBeforeClosing: string, body: BlockStatement) {
        this.type = Syntax.CatchClause;
        this.param = param;
        this.body = body;
        this.wsBefore = wsBefore;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseCatchClause = (e: CatchClause, parent?: Unparsable) =>
  e.wsBefore +
  'catch' +
  e.wsBeforeOpening +
  '(' +
  unparseChild(e)(e.param) +
  e.wsBeforeClosing +
  ')' +
  unparseChild(e)(e.body) +
  e.wsAfter;

export class ClassBody {
    type: string;
    body: Property[];
    wsBefore: string = '';
    wsBeforeOpening: string;
    wsAfterOpening: string;
    wsBeforeClosing: string;
    wsAfter: string = '';
    constructor(wsBeforeOpening: string, wsAfterOpening: string, body: Property[], wsBeforeClosing: string) {
        this.type = Syntax.ClassBody;
        this.body = body;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsAfterOpening = wsAfterOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseClassBody = (e: ClassBody, parent?: Unparsable) =>
  e.wsBefore +
   e.wsBeforeOpening +
   '{' +
   e.wsAfterOpening +
   unparseChildren(e)(e.body) +
   e.wsBeforeClosing +
   '}' +
   e.wsAfter;

const classDeclarationUnparser = function(e: ClassDeclaration | ClassExpression, parent) {
  return e.wsBefore +
        'class' +
        unparseChild(e)(e.id) +
        (e.superClass ? e.wsBeforeExtends + 'extends' +
        unparseChild(e)(e.superClass) : '') +
        unparseChild(e)(e.body) +
        e.wsAfter;
};
export class ClassDeclaration {
    type: string;
    id: Identifier | null;
    superClass: Identifier | null;
    body: ClassBody;
    wsBefore: string;
    wsBeforeExtends: string;
    wsAfter: string = '';
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
var unparseClassDeclaration = classDeclarationUnparser;

export class ClassExpression {
    type: string;
    id: Identifier | null;
    superClass: Identifier | null;
    body: ClassBody;
    wsBefore: string;
    wsBeforeExtends: string;
    wsAfter: string = '';
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
var unparseClassExpression = classDeclarationUnparser;

export class ComputedMemberExpression {
    type: string;
    computed: boolean;
    object: Expression;
    property: Expression;
    wsBefore: string = '';
    wsBeforeOpening: string;
    wsBeforeClosing: string;
    wsAfter: string = '';
    constructor(object: Expression, wsBeforeOpening: string, property: Expression, wsBeforeClosing: string) {
        this.type = Syntax.MemberExpression;
        this.computed = true;
        this.object = object;
        this.property = property;
        this.wsBeforeOpening = wsBeforeOpening;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseMemberExpression = (e: ComputedMemberExpression | StaticMemberExpression, parent?: Unparsable) =>
  e.wsBefore +
    unparseChild(e)(e.object) +
    e.wsBeforeOpening +
    (e.computed ? '[' : '.') +
    unparseChild(e)(e.property) +
    e.wsBeforeClosing +
    (e.computed ? ']' : '') +
    e.wsAfter;

export class ConditionalExpression {
    type: string;
    test: Expression;
    consequent: Expression;
    alternate: Expression;
    wsBefore: string = '';
    wsBeforeQues: string;
    wsBeforeColon: string;
    wsAfter: string = '';
    constructor(test: Expression, wsBeforeQues: string, consequent: Expression, wsBeforeColon: string, alternate: Expression) {
        this.type = Syntax.ConditionalExpression;
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.wsBeforeQues = wsBeforeQues;
        this.wsBeforeColon = wsBeforeColon;
    }
}
var unparseConditionalExpression = (e: ConditionalExpression, parent?: Unparsable) =>
 e.wsBefore +
  unparseChild(e)(e.test) +
  e.wsBeforeQues +
  '?' +
  unparseChild(e)(e.consequent) +
  e.wsBeforeColon +
  ':' +
  unparseChild(e)(e.alternate) +
  e.wsAfter;

export class ContinueStatement {
    type: string;
    label: Identifier | null;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, label: Identifier | null, semicolon: string) {
        this.type = Syntax.ContinueStatement;
        this.label = label;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
var unparseContinueStatement = controlLabelStatementUnparseData("continue");

export class DebuggerStatement {
    type: string;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, semicolon: string) {
        this.type = Syntax.DebuggerStatement;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
var unparseDebuggerStatement = (e: DebuggerStatement, parent?: Unparsable) =>
  e.wsBefore +
  'debugger' +
  e.semicolon;

export class Directive {
    type: string;
    expression: Expression;
    directive: string;
    wsBefore: string = '';
    semicolon: string;
    wsAfter: string = '';
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
var unparseDoWhileStatement = (e: DoWhileStatement, parent?: Unparsable) =>
  e.wsBefore +
   'do' +
   unparseChild(e)(e.body) +
   e.wsBeforeWhile +
   'while' +
   e.wsBeforeOpening +
   '(' +
   unparseChild(e)(e.test) +
   e.wsBeforeClosing +
   e.closingParens + e.semicolon +
   e.wsAfter;

export class EmptyStatement {
    type: string;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, semicolon: string = ';') {
        this.type = Syntax.EmptyStatement;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
var unparseEmptyStatement = (e: EmptyStatement, parent?: Unparsable) =>
  e.wsBefore + e.semicolon + e.wsAfter;

export class ExportAllDeclaration {
    type: string;
    source: Literal;
    wsBefore: string;
    wsBeforeStar: string;
    wsBeforeFrom: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, wsBeforeStar: string, wsBeforeFrom: string, source: Literal, semicolon: string = '') {
        this.type = Syntax.ExportAllDeclaration;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.wsBeforeFrom = wsBeforeFrom;
        this.source = source;
        this.semicolon = semicolon;
    }
}
var unparseExportAllDeclaration = (e: ExportAllDeclaration, parent?: Unparsable) =>
  e.wsBefore +
    'export' +
    e.wsBeforeStar +
    '*' +
    e.wsBeforeFrom +
    'from' +
    unparseChild(e)(e.source) +
    e.semicolon +
    e.wsAfter;

export class ExportDefaultDeclaration {
    type: string;
    declaration: ExportableDefaultDeclaration;
    wsBefore: string;
    wsBeforeDefault: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, wsBeforeDefault: string, declaration: ExportableDefaultDeclaration, semicolon: string = '') {
        this.type = Syntax.ExportDefaultDeclaration;
        this.declaration = declaration;
        this.wsBefore = wsBefore;
        this.wsBeforeDefault = wsBeforeDefault;
        this.semicolon = semicolon;
    }
}
var unparseExportDefaultDeclaration = (e: ExportDefaultDeclaration, parent?: Unparsable) =>
  e.wsBefore +
    'export' +
    e.wsBeforeDefault +
    'default' +
    unparseChild(e)(e.declaration) +
    e.semicolon +
    e.wsAfter;

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
var unparseExportNamedDeclaration = (e: ExportNamedDeclaration, parent?: Unparsable) =>
  e.wsBefore +
    'export' +
    (e.declaration ?
       unparseChild(e)(e.declaration) : '') +
    (e.specifiers.length || e.hasBrackets ?
      e.wsBeforeOpening + '{' + unparseChildren(e, e.separators, ',')(e.specifiers) + e.wsBeforeClosing + '}'
      : ''
    ) +
    (e.source ? e.wsBeforeFrom + 'from' + unparseChild(e)(e.source) : '') + e.semicolon + e.wsAfter;

export class ExportSpecifier {
    type: string;
    exported: Identifier;
    local: Identifier;
    noAs: boolean;
    wsBefore: string = '';
    wsBeforeAs: string;
    wsAfter: string = '';
    constructor(local: Identifier, noAs: boolean, wsBeforeAs: string, exported: Identifier) {
        this.type = Syntax.ExportSpecifier;
        this.exported = exported;
        this.local = local;
        this.noAs = noAs;
        this.wsBeforeAs = wsBeforeAs;
    }
}
var unparseExportSpecifier = function (e: ExportSpecifier, parent?: Unparsable): string {
  const localStr = unparseChild(e)(e.local);
  const exportedStr = unparseChild(e)(e.exported);
  return e.wsBefore +
    localStr +
    (e.noAs && localStr === exportedStr ?
        ''
      : e.wsBeforeAs + 'as' + unparseChild(e)(e.exported)) +
    e.wsAfter;
}

export class ExpressionStatement {
    type: string;
    expression: Expression;
    semicolon: string;
    wsBefore: string = '';
    wsAfter: string = '';
    constructor(expression: Expression, semicolon: string) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
        this.semicolon = semicolon;
    }
}
var unparseExpressionStatement = function(e: ExpressionStatement, parent?: Unparsable): string {
    return e.wsBefore +
      unparseChild(e)(e.expression) + e.semicolon +
      e.wsAfter;
  }

const forCollectionUnparser = keyword => function(e: ForInStatement | ForOfStatement, parent) {
  return e.wsBefore +
    e.wsBeforeFor + 'for' + e.wsBeforeOpening + '(' +
    unparseChild(e)(e.left) +
    e.wsBeforeKeyword + keyword +
    unparseChild(e)(e.right) +
    e.wsBeforeClosing + e.closingParens +
    unparseChild(e)(e.body) +
    e.wsAfter;
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
var unparseForInStatement = forCollectionUnparser("in");

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
var unparseForOfStatement = forCollectionUnparser("of");

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
var unparseForStatement = 
    function(e: ForStatement, parent?: Unparsable): string {
      return e.wsBefore +
        e.wsBeforeFor + 'for' + e.wsBeforeOpening + '(' +
        unparseChild(e)(e.init) +
        e.wsBeforeSemicolon1 + ';' +
        unparseChild(e)(e.test) +
        e.wsBeforeSemicolon2 + ';' +
        unparseChild(e)(e.update) +
        e.wsBeforeClosing + e.closingParens +
        unparseChild(e)(e.body) +
        e.wsAfter;
    }

export class FunctionDeclaration {
    type: string;
    id: Identifier | null; // Cannot be null for declarations
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
var unparseFunctionDeclaration = functionDeclarationUnparser;

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
var unparseFunctionExpression = functionDeclarationUnparser

export class Identifier {
    type: string;
    name: string; // can be modified
    original: string;
    nameRaw: string;
    wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, name: string, nameRaw?: string) {
        this.type = Syntax.Identifier;
        this.name = name;
        this.original = name;
        this.nameRaw = typeof nameRaw == "undefined" ? name : nameRaw;
        this.wsBefore = wsBefore;
    }
}
var unparseIdentifier = function(e: Identifier, parent?: Unparsable): string {
  return e.wsBefore + (e.name === e.original ? e.nameRaw : e.name) + e.wsAfter;
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
var unparseIfStatement = function(e: IfStatement, parent?: Unparsable): string {
  return e.wsBefore + e.ifKeyword +
    e.wsBeforeOpening + '(' +
    unparseChild(e)(e.test) +
    e.wsBeforeClosing + e.closingParens +
    unparseChild(e)(e.consequent) +
    (e.alternate ?
       e.wsBeforeElse + 'else' + unparseChild(e)(e.alternate) : '') +
    e.wsAfter;
}

export class Import {
    type: string;
    wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore) {
        this.type = Syntax.Import;
        this.wsBefore = wsBefore;
    }
}
var unparseImport = function(e: Import, parent?: Unparsable): string {
  return e.wsBefore + 'import' + e.wsAfter;
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
var unparseImportDeclaration = function(e: ImportDeclaration, parent?: Unparsable): string {
      let result = e.wsBefore + 'import';
      if (e.specifiers.length === 0 && !e.hasBrackets) {
        return result + unparseChild(e)(e.source) + e.semicolon + e.wsAfter;
      }
      let insideImportSpecifiers = false;
      for (let i = 0; i < e.specifiers.length; i++) {
        const specifier = e.specifiers[i];
        if (specifier.type === Syntax.ImportSpecifier) {
          if (!insideImportSpecifiers) {
            result += e.wsBeforeOpening + '{';
            insideImportSpecifiers = true;
          }
        }
        result += unparseChild(e)(specifier);
        if (i < e.separators.length) {
          result += e.separators[i];
        } else if (i < e.specifiers.length - 1) {
          result += ', ';
        }
      }
      if (!insideImportSpecifiers && e.hasBrackets) {
        result += e.wsBeforeOpening + '{';
        insideImportSpecifiers = true;
      }
      if (insideImportSpecifiers) {
        result += e.wsBeforeClosing + '}';
      }
      return result + e.wsBeforeFrom + 'from' +
         unparseChild(e)(e.source) + e.semicolon + e.wsAfter;
    }

export class ImportDefaultSpecifier {
    type: string;
    local: Identifier;
    wsBefore: string = '';
    wsAfter: string = '';
    constructor(local: Identifier) {
        this.type = Syntax.ImportDefaultSpecifier;
        this.local = local;
    }
}
var unparseImportDefaultSpecifier = function(e: ImportDefaultSpecifier, parent?: Unparsable): string {
      return e.wsBefore + unparseChild(e)(e.local) + e.wsAfter;
    }

export class ImportNamespaceSpecifier {
    type: string;
    local: Identifier;
    wsBefore: string;
    wsBeforeAs: string;
    wsAfter: string = '';
    constructor(wsBefore: string, wsBeforeAs: string, local: Identifier) {
        this.type = Syntax.ImportNamespaceSpecifier;
        this.wsBefore = wsBefore;
        this.wsBeforeAs = wsBeforeAs;
        this.local = local;
    }
}
var unparseImportNamespaceSpecifier = function(e: ImportNamespaceSpecifier, parent?: Unparsable): string {
      return e.wsBefore + '*' + e.wsBeforeAs + 'as' +
        unparseChild(e)(e.local) + e.wsAfter;
    }


export class ImportSpecifier {
    type: string;
    local: Identifier;
    imported: Identifier;
    asPresent: boolean;
    wsBefore: string = '';
    wsBeforeAs: string;
    wsAfter: string = '';
    constructor(local: Identifier, asPresent: boolean, wsBeforeAs: string, imported: Identifier) {
        this.type = Syntax.ImportSpecifier;
        this.local = local;
        this.imported = imported;
        this.asPresent = asPresent;
        this.wsBeforeAs = wsBeforeAs;
    }
}
var unparseImportSpecifier = function(e: ImportSpecifier, parent?: Unparsable): string {
      return e.wsBefore +
        unparseChild(e)(e.imported) +
        (e.asPresent ? e.wsBeforeAs + 'as' +
        unparseChild(e)(e.local) : '') + e.wsAfter;
    }


export class LabeledStatement {
    type: string;
    label: Identifier;
    body: Statement | ClassDeclaration;
    wsBefore: string = '';
    wsBeforeColon: string;
    wsAfter: string = '';
    constructor(label: Identifier, wsBeforeColon: string, body: Statement | ClassDeclaration) {
        this.type = Syntax.LabeledStatement;
        this.label = label;
        this.body = body;
        this.wsBeforeColon = wsBeforeColon;
    }
}
var unparseLabeledStatement = function(e: LabeledStatement, parent?: Unparsable): string {
      return e.wsBefore +
        unparseChild(e)(e.label) +
        e.wsBeforeColon + ':' +
        unparseChild(e)(e.body) +
        e.wsAfter;
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
    constructor(wsBefore: string, value: boolean | number | string | null, raw: string) {
        this.type = Syntax.Literal;
        this.value = value;
        this.raw = raw;
        this.original = value;
        this.wsBefore = wsBefore;
    }
}
var unparseLiteral = function(e: Literal | RegexLiteral, parent?: Unparsable): string {
  if("regex" in e) {
    return e.wsBefore +
        (e.original.pattern === e.regex.pattern &&
         e.original.flags === e.regex.flags ? e.raw :
        '/' +
        e.regex.pattern +
        '/' +
        e.regex.flags) + e.wsAfter;
  }
      return e.wsBefore +
        (e.original === e.value ? e.raw :
        typeof e.value === 'string' && typeof e.original === 'string' ?
            toExpString(e.value, e.raw) :
          typeof e.value === 'object' ?
            e.value === null ?
              'null' :
              uneval(e.value) :
          uneval(e.value)) + e.wsAfter;
    }

export class MetaProperty {
    type: string;
    meta: Identifier;
    property: Identifier;
    wsBefore: string = '';
    wsBeforeDot: string;
    wsAfter: string = '';
    constructor(meta: Identifier, wsBeforeDot: string, property: Identifier) {
        this.type = Syntax.MetaProperty;
        this.meta = meta;
        this.property = property;
        this.wsBeforeDot = wsBeforeDot;
    }
}
var unparseMetaProperty = function(e: MetaProperty, parent?: Unparsable): string {
      return e.wsBefore +
        unparseChild(e)(e.meta) +
        e.wsBeforeDot + '.' +
        unparseChild(e)(e.property) +
        e.wsAfter;
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
var unparseMethodDefinition = function(e: MethodDefinition, parent?: Unparsable): string {
      const keyStr = unparseChild(e)(e.key);
      return e.wsBefore +
        (e.static ? e.wsBeforeStatic + 'static' : '') +
        (e.value && isFunctionExpression(e.value) ?
          (e.value.async ? e.value.wsBeforeAsync + 'async' : '') +
          (e.value.generator ? e.value.wsBeforeStar + '*' : '') : '') +
        (e.kind === 'set' || e.kind === 'get' ? e.wsBeforeGetSet + e.kind : '') +
        (e.computed ? e.wsBeforeOpening + '[' : '') +
        keyStr +
        (e.computed ? e.wsBeforeClosing + ']' : '') +
        unparseChild(e)(e.value) +
        e.wsAfter;
    }


export class Module {
    type: string;
    body: StatementListItem[];
    sourceType: string;
    wsBefore: string = '';
    wsAfter: string;
    constructor(body: StatementListItem[], wsAfter: string) {
        this.type = Syntax.Program;
        this.body = body;
        this.sourceType = 'module';
        this.wsAfter = wsAfter;
    }
}
var unparseProgram = function(e: Module | Script, parent?: Unparsable): string {
      return e.wsBefore + unparseChildren(e)(e.body) + e.wsAfter;
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
var unparseNewExpression = function(e: NewExpression, parent?: Unparsable): string {
      return e.wsBefore +
        e.wsBeforeNew + 'new' +
        unparseChild(e)(e.callee) +
        (e.parentheses || e.arguments.length > 0 ?
          e.wsBeforeOpening + '(' +
          unparseChildren(e, e.separators, ', ')(e.arguments) +
          e.wsBeforeClosing + ')'
        : '') +
        e.wsAfter;
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
    constructor(wsBefore: string, properties: ObjectExpressionProperty[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ObjectExpression;
        this.properties = properties;
        this.wsBefore = wsBefore;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseObjectExpression = function(e: ObjectExpression, parent?: Unparsable): string {
      return objectExpressionPatternUnparse.bind(e)();
    }


export class ObjectPattern {
    type: string;
    properties: ObjectPatternProperty[];
    wsBefore: string;
    separators: string[];
    wsBeforeClosing: string;
    wsAfter: string = '';
    constructor(wsBefore: string, properties: ObjectPatternProperty[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.ObjectPattern;
        this.properties = properties;
        this.wsBefore = wsBefore;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseObjectPattern = function(e: ObjectPattern, parent?: Unparsable): string {
      return objectExpressionPatternUnparse.bind(e)();
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
var unparseProperty = function(e: Property, parent?: Unparsable): string {
      const ap = e.value && isAssignmentPattern(e.value);
      return e.wsBefore + (e.method && e.value ?
        isFunctionExpression(e.value) ?
          (e.value.async ? e.value.wsBeforeAsync + 'async' : '') +
          (e.value.generator ? e.value.wsBeforeStar + '*' : '') : ''
      : '') +
        (e.kind === 'get' || e.kind === 'set' ? e.wsBeforeGetSet + e.kind : '') +
        (!e.shorthand || (e.value && !ap) ? (e.computed ? e.wsBeforeOpening + '[' : '') + unparseChild(e)(e.key) + (e.computed ? e.wsBeforeClosing + ']' : '')  : '') +
        (e.method || e.shorthand || e.kind === 'get' || e.kind === 'set' ? '' : e.wsBeforeColon + ':') +
        (e.shorthand && !ap ? '' : unparseChild(e)(e.value)) + e.wsAfter;
    }


export class RegexLiteral {
    type: string;
    value: RegExp;
    raw: string;
    regex: { pattern: string, flags: string };
    original: { pattern: string, flags: string };
    wsBefore: string;
    wsAfter: string = '';
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
    constructor(wsBefore: string, argument: BindingIdentifier | BindingPattern) {
        this.type = Syntax.RestElement;
        this.argument = argument;
        this.wsBefore = wsBefore;
    }
}
var unparseRestElement = function(e: RestElement, parent?: Unparsable): string {
      return e.wsBefore + '...' +
        unparseChild(e)(e.argument) +
        e.wsAfter;
    }


export class ReturnStatement {
    type: string;
    argument: Expression | null;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, argument: Expression | null, semicolon: string) {
        this.type = Syntax.ReturnStatement;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
var unparseReturnStatement = function(e: ReturnStatement, parent?: Unparsable): string {
      return e.wsBefore + 'return' +
        unparseChild(e)(e.argument) +
        e.semicolon + e.wsAfter;
    }


export class Script {
    type: string;
    body: StatementListItem[];
    sourceType: string;
    wsBefore: string = '';
    wsAfter: string;
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
    constructor(parentheses: boolean, wsBeforeOpening: string, expressions: Expression[], separators: string[], wsBeforeClosing: string) {
        this.type = Syntax.SequenceExpression;
        this.expressions = expressions;
        this.parentheses = parentheses;
        this.wsBeforeOpening = wsBeforeOpening;
        this.separators = separators;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseSequenceExpression = function(e: SequenceExpression, parent?: Unparsable): string {
      return e.wsBefore +
        (e.parentheses ? e.wsBeforeOpening + '(' : '') +
        unparseChildren(e, e.separators, ', ')(e.expressions) +
        (e.parentheses ? e.wsBeforeClosing + ')' : '') +
        e.wsAfter;
    }


export class SpreadElement {
    type: string;
    argument: Expression;
    wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, argument: Expression) {
        this.type = Syntax.SpreadElement;
        this.argument = argument;
        this.wsBefore = wsBefore;
    }
}
var unparseSpreadElement = function(e: SpreadElement, parent?: Unparsable): string {
      return e.wsBefore + '...' +
        unparseChild(e)(e.argument) +
        e.wsAfter;
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
    constructor(wsBefore: string) {
        this.type = Syntax.Super;
        this.wsBefore = wsBefore;
    }
}
var unparseSuper = function(e: Super, parent?: Unparsable): string {
      return e.wsBefore + 'super' + e.wsAfter;
    }


export class SwitchCase {
    type: string;
    test: Expression | null;
    consequent: StatementListItem[];
    wsBefore: string;
    wsBeforeColon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, test: Expression, wsBeforeColon: string, consequent: StatementListItem[]) {
        this.type = Syntax.SwitchCase;
        this.test = test;
        this.consequent = consequent;
        this.wsBefore = wsBefore;
        this.wsBeforeColon = wsBeforeColon;
    }
}
var unparseSwitchCase = function(e: SwitchCase, parent?: Unparsable): string {
      return e.wsBefore + (e.test ? 'case' + unparseChild(e)(e.test) : 'default') +
        e.wsBeforeColon + ':' +
        unparseChildren(e)(e.consequent) + e.wsAfter;
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
var unparseSwitchStatement = function(e: SwitchStatement, parent?: Unparsable): string {
      return e.wsBefore + 'switch' + e.wsBeforeOpening +
        '(' + unparseChild(e)(e.discriminant) + e.wsBeforeClosing +
        ')' + e.wsBeforeBlockOpening + '{' +
        unparseChildren(e)(e.cases) +
        e.wsBeforeBlockClosing + '}' + e.wsAfter;
    }


export class TaggedTemplateExpression {
    type: string;
    tag: Expression;
    quasi: TemplateLiteral;
    wsBefore: string = '';
    wsAfter: string = '';
    constructor(tag: Expression, quasi: TemplateLiteral) {
        this.type = Syntax.TaggedTemplateExpression;
        this.tag = tag;
        this.quasi = quasi;
    }
}
var unparseTaggedTemplateExpression = function(e: TaggedTemplateExpression, parent?: Unparsable): string {
      return e.wsBefore +
        unparseChild(e)(e.tag) + unparseChild(e)(e.quasi) +
        e.wsAfter;
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
    constructor(value: TemplateElementValue, tail: boolean) {
        this.type = Syntax.TemplateElement;
        this.value = value;
        this.originalCooked = value.cooked;
        this.tail = tail;
    }
}
var unparseTemplateElement = function(e: TemplateElement, parent?: Unparsable): string {
      return e.wsBefore +
        (e.value.cooked === e.originalCooked ? e.value.raw :
          e.value.cooked.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')) +
        e.wsAfter;
    }


export class TemplateLiteral {
    type: string;
    quasis: TemplateElement[];
    expressions: Expression[];
    wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, quasis: TemplateElement[], expressions: Expression[]) {
        this.type = Syntax.TemplateLiteral;
        this.quasis = quasis;
        this.expressions = expressions;
        this.wsBefore = wsBefore;
    }
}
var unparseTemplateLiteral = function(e: TemplateLiteral, parent?: Unparsable): string {
      let result = '';
      for (let i = 0; i < e.quasis.length; i++) {
        result += unparseChild(e)(e.quasis[i]) + (i < e.expressions.length ? '${' + unparseChild(e)(e.expressions[i]) + '}' : '');
      }
      return e.wsBefore + '`' + result + '`' + e.wsAfter;
    }


export class ThisExpression {
    type: string;
    wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string) {
        this.type = Syntax.ThisExpression;
        this.wsBefore = wsBefore;
    }
}
var unparseThisExpression = function(e: ThisExpression, parent?: Unparsable): string {
      return e.wsBefore + 'this' + e.wsAfter;
    }


export class ThrowStatement {
    type: string;
    argument: Expression;
    wsBefore: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, argument: Expression, semicolon: string) {
        this.type = Syntax.ThrowStatement;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.semicolon = semicolon;
    }
}
var unparseThrowStatement = function(e: ThrowStatement, parent?: Unparsable): string {
      return e.wsBefore + 'throw' +
        unparseChild(e)(e.argument) + e.semicolon +
        e.wsAfter;
    }


export class TryStatement {
    type: string;
    block: BlockStatement;
    handler: CatchClause | null;
    finalizer: BlockStatement | null;
    wsBefore: string;
    wsBeforeFinally: string;
    wsAfter: string = '';
    constructor(wsBefore: string, block: BlockStatement, handler: CatchClause | null, wsBeforeFinally: string, finalizer: BlockStatement | null) {
        this.type = Syntax.TryStatement;
        this.block = block;
        this.handler = handler;
        this.finalizer = finalizer;
        this.wsBefore = wsBefore;
        this.wsBeforeFinally = wsBeforeFinally;
    }
}
var unparseTryStatement = function(e: TryStatement, parent?: Unparsable): string {
      return e.wsBefore + 'try' +
        unparseChild(e)(e.block) +
        unparseChild(e)(e.handler) +
        (e.finalizer ? e.wsBeforeFinally + 'finally' + unparseChild(e)(e.finalizer) : '') +
        e.wsAfter;
    }


export class UnaryExpression {
    type: string;
    operator: string;
    argument: Expression;
    prefix: boolean;
    wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, operator, argument) {
        this.type = Syntax.UnaryExpression;
        this.operator = operator;
        this.argument = argument;
        this.prefix = true;
        this.wsBefore = wsBefore;
    }
}
var unparseUnaryExpression = function(e: UnaryExpression, parent?: Unparsable): string {
      return e.wsBefore + e.operator +
        unparseChild(e)(e.argument) + e.wsAfter;
    }


export class UpdateExpression {
    type: string;
    operator: string;
    argument: Expression;
    prefix: boolean;
    wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, operator, argument, prefix) {
        this.type = Syntax.UpdateExpression;
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
        this.wsBefore = wsBefore;
    }
}
var unparseUpdateExpression = function(e: UpdateExpression, parent?: Unparsable): string {
      return (e.prefix ? e.wsBefore + e.operator : '') +
        unparseChild(e)(e.argument) +
        (e.prefix ? '' : e.wsBefore + e.operator) +
        e.wsAfter;
    }


export class VariableDeclaration {
    type: string;
    declarations: VariableDeclarator[];
    kind: string;
    wsBefore: string;
    separators: string[];
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, declarations: VariableDeclarator[], separators: string[], kind: string, semicolon: string) {
        this.type = Syntax.VariableDeclaration;
        this.declarations = declarations;
        this.kind = kind;
        this.wsBefore = wsBefore;
        this.separators = separators;
        this.semicolon = semicolon;
    }
}
var unparseVariableDeclaration = function(e: VariableDeclaration, parent?: Unparsable): string {
      return e.wsBefore + e.kind + unparseChildren(e, e.separators, ', ')(e.declarations) +
        e.semicolon + e.wsAfter;
    }


export class VariableDeclarator {
    type: string;
    id: BindingIdentifier | BindingPattern;
    init: Expression | null;
    wsBefore: string = '';
    wsBeforeEq: string;
    wsAfter: string = '';
    constructor(id: BindingIdentifier | BindingPattern, wsBeforeEq: string, init: Expression | null) {
        this.type = Syntax.VariableDeclarator;
        this.id = id;
        this.wsBeforeEq = wsBeforeEq;
        this.init = init;
    }
}
var unparseVariableDeclarator = function(e: VariableDeclarator, parent?: Unparsable): string {
      return e.wsBefore +
        unparseChild(e)(e.id) +
        (e.init ? e.wsBeforeEq + '=' + unparseChild(e)(e.init) : '') +
        e.wsAfter;
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
var unparseWhileStatement = function(e: WhileStatement, parent?: Unparsable): string {
      return e.wsBefore + 'while' + e.wsBeforeOpening +
        '(' + unparseChild(e)(e.test) + e.wsBeforeClosing + e.closingParens +
        unparseChild(e)(e.body) +
        e.wsAfter;
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
var unparseWithStatement = function(e: WithStatement, parent?: Unparsable): string {
      return e.wsBefore + 'with' + e.wsBeforeOpening + '(' +
        unparseChild(e)(e.object) + e.wsBeforeClosing + e.closingParens +
        unparseChild(e)(e.body) +
        e.wsAfter;
    }


export class YieldExpression {
    type: string;
    argument: Expression | null;
    delegate: boolean;
    wsBefore: string;
    wsBeforeStar: string;
    semicolon: string;
    wsAfter: string = '';
    constructor(wsBefore: string, wsBeforeStar: string, argument: Expression | null, delegate: boolean, semicolon: string) {
        this.type = Syntax.YieldExpression;
        this.argument = argument;
        this.delegate = delegate;
        this.wsBefore = wsBefore;
        this.wsBeforeStar = wsBeforeStar;
        this.semicolon = semicolon;
    }
}
var unparseYieldExpression = function(e: YieldExpression, parent?: Unparsable): string {
      return e.wsBefore + 'yield' + (e.delegate ? e.wsBeforeStar + '*' : '') +
        (e.argument ? unparseChild(e)(e.argument) : '') + e.semicolon + e.wsAfter;
    }


export var unparsers: any = {
  [Syntax.ArrayExpression]: unparseArrayExpression,
  [Syntax.ArrayPattern]: unparseArrayPattern,
  [Syntax.ArrowFunctionExpression]: unparseArrowFunctionExpression,
  [Syntax.AssignmentExpression]: unparseAssignmentExpression,
  [Syntax.AssignmentPattern]: unparseAssignmentPattern,
  [Syntax.AwaitExpression]: unparseAwaitExpression,
  [Syntax.BinaryExpression]: unparseBinaryExpression,
  [Syntax.BlockStatement]: unparseBlockStatement,
  [Syntax.BreakStatement]: unparseBreakStatement,
  [Syntax.ContinueStatement]: unparseContinueStatement,
  [Syntax.CallExpression]: unparseCallExpression,
  [Syntax.CatchClause]: unparseCatchClause,
  [Syntax.ClassBody]: unparseClassBody,
  [Syntax.ClassDeclaration]: unparseClassDeclaration,
  [Syntax.ClassExpression]: unparseClassExpression,
  [Syntax.ConditionalExpression]: unparseConditionalExpression,
  [Syntax.DebuggerStatement]: unparseDebuggerStatement,
  [Syntax.DoWhileStatement]: unparseDoWhileStatement,
  [Syntax.EmptyStatement]: unparseEmptyStatement,
  [Syntax.ExportAllDeclaration]: unparseExportAllDeclaration,
  [Syntax.ExportDefaultDeclaration]: unparseExportDefaultDeclaration,
  [Syntax.ExportNamedDeclaration]: unparseExportNamedDeclaration,
  [Syntax.ExportSpecifier]: unparseExportSpecifier,
  [Syntax.ExpressionStatement]: unparseExpressionStatement,
  [Syntax.ForInStatement]: unparseForInStatement,
  [Syntax.ForOfStatement]: unparseForOfStatement,
  [Syntax.ForStatement]: unparseForStatement,
  [Syntax.FunctionDeclaration]: unparseFunctionDeclaration,
  [Syntax.FunctionExpression]: unparseFunctionExpression,
  [Syntax.Identifier]: unparseIdentifier,
  [Syntax.MemberExpression]: unparseMemberExpression,
  [Syntax.IfStatement]: unparseIfStatement,
  [Syntax.Import]: unparseImport,
  [Syntax.ImportDeclaration]: unparseImportDeclaration,
  [Syntax.ImportDefaultSpecifier]: unparseImportDefaultSpecifier,
  [Syntax.ImportNamespaceSpecifier]: unparseImportNamespaceSpecifier,
  [Syntax.ImportSpecifier]: unparseImportSpecifier,
  [Syntax.LabeledStatement]: unparseLabeledStatement,
  [Syntax.Literal]: unparseLiteral,
  [Syntax.LogicalExpression]: unparseLogicalExpression,
  [Syntax.MetaProperty]: unparseMetaProperty,
  [Syntax.MethodDefinition]: unparseMethodDefinition,
  [Syntax.Program]: unparseProgram,
  [Syntax.NewExpression]: unparseNewExpression,
  [Syntax.ObjectExpression]: unparseObjectExpression,
  [Syntax.ObjectPattern]: unparseObjectPattern,
  [Syntax.Property]: unparseProperty,
  [Syntax.RestElement]: unparseRestElement,
  [Syntax.ReturnStatement]: unparseReturnStatement,
  [Syntax.SequenceExpression]: unparseSequenceExpression,
  [Syntax.SpreadElement]: unparseSpreadElement,
  [Syntax.Super]: unparseSuper,
  [Syntax.SwitchCase]: unparseSwitchCase,
  [Syntax.SwitchStatement]: unparseSwitchStatement,
  [Syntax.TaggedTemplateExpression]: unparseTaggedTemplateExpression,
  [Syntax.TemplateElement]: unparseTemplateElement,
  [Syntax.TemplateLiteral]: unparseTemplateLiteral,
  [Syntax.ThisExpression]: unparseThisExpression,
  [Syntax.ThrowStatement]: unparseThrowStatement,
  [Syntax.TryStatement]: unparseTryStatement,
  [Syntax.UnaryExpression]: unparseUnaryExpression,
  [Syntax.UpdateExpression]: unparseUpdateExpression,
  [Syntax.VariableDeclaration]: unparseVariableDeclaration,
  [Syntax.VariableDeclarator]: unparseVariableDeclarator,
  [Syntax.WhileStatement]: unparseWhileStatement,
  [Syntax.WithStatement]: unparseWithStatement,
  [Syntax.YieldExpression]: unparseYieldExpression
}

// Slightly less efficient than virtual dispatch but more flexible as we can now copy the nodes without definining clone methods.
export function unparse(e: UnparsableOrNull | undefined, parent?: Unparsable): string {
  if(e === null || typeof e === "undefined") return "";
  let unparser = unparsers[e.type];
  if(typeof unparser !== "function") {
    console.log(e);
    console.log("Unparser not found");
  }
  return unparser(e, parent);
}