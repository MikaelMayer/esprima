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

var singleChildMap = (body, unparser) => unparser(body);
var multiChildMap = (join = "") => (params, unparser) =>
         params.map(unparser).join(join);

var arrayUnparser = [
          {name: "wsBefore"},
          "[",
          {name: "elements", map: multiChildMap(",")},
          {name: "wsBeforeClosing"},
          "]"];

/* tslint:disable:max-classes-per-file */
/* type alias UnparseElement =
     ({name: string, map?: (typeof this[name], { unparseData: UnparseElement[] } => UnparseElement ) => string} | string);
   type alias UnparseArray = UnparseElement[] */
export class ArrayExpression {
    readonly type: string;
    readonly elements: ArrayExpressionElement[];
    readonly wsBefore: string;
    readonly unparseData: UnparseArray; 
    readonly wsBeforeClosing: string;
    constructor(wsBefore: string, wsBeforeClosing: string, elements: ArrayExpressionElement[]) {
        this.type = Syntax.ArrayExpression;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
        this.unparseData = arrayUnparser;
    }
}

export class ArrayPattern {
    readonly type: string;
    readonly elements: ArrayPatternElement[];
    readonly wsBefore: string;
    readonly unparseData: UnparseArray;
    readonly wsBeforeClosing: string;
    constructor(wsBefore: string, wsBeforeClosing: string, elements: ArrayPatternElement[]) {
        this.type = Syntax.ArrayPattern;
        this.elements = elements;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
        this.unparseData = arrayUnparser;
    }
}

const arrowUnparseData =  [
  {name: "async", map: (async) => async ? "async " : ""},
  {name: "wsBefore"},
  {name: "params", map: multiChildMap() },
  {name: "wsBeforeArrow"},
  {name: "arrow"},
  {name: "body", map: singleChildMap }
  ]

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
    readonly unparseData: UnparseArray; 
    constructor(wsBefore: string, params: FunctionParameter[], wsBeforeArrow: string, arrow: string, body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = false;
        this.wsBeforeArrow = wsBeforeArrow;
        this.arrow = arrow;
        this.wsBefore = wsBefore;
        this.unparseData = arrowUnparseData;
    }
}

var binaryUnparseData = [
  {name: "left", map: singleChildMap},
   {name: "wsBeforeOp"},
   {name: "operator"},
   {name: "right", map: singleChildMap}
]

export class AssignmentExpression {
    readonly type: string;
    readonly operator: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly wsBeforeOp: string;
    readonly unparseData: UnparseArray; 
    constructor(wsBeforeOp: string, operator: string, left: Expression, right: Expression) {
        this.type = Syntax.AssignmentExpression;
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.wsBeforeOp = wsBeforeOp;
        this.unparseData = binaryUnparseData;
    }
}

export class AssignmentPattern {
    readonly type: string;
    readonly left: BindingIdentifier | BindingPattern;
    readonly right: Expression;
    readonly unparseData: UnparseArray; 
    constructor(left: BindingIdentifier | BindingPattern, right: Expression) {
        this.type = Syntax.AssignmentPattern;
        this.left = left;
        this.right = right;
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
    readonly unparseData: UnparseArray; 
    constructor(params: FunctionParameter[], body: BlockStatement | Expression, expression: boolean) {
        this.type = Syntax.ArrowFunctionExpression;
        this.id = null;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = expression;
        this.async = true;
    }
}

export class AsyncFunctionDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    readonly unparseData: UnparseArray; 
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
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
    readonly unparseData: UnparseArray; 
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = false;
        this.expression = false;
        this.async = true;
    }
}

export class AwaitExpression {
    readonly type: string;
    readonly argument: Expression;
    readonly unparseData: UnparseArray; 
    constructor(argument: Expression) {
        this.type = Syntax.AwaitExpression;
        this.argument = argument;
    }
}

export class BinaryExpression {
    readonly type: string;
    readonly operator: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly wsBefore: string;
    readonly wsBeforeOp: string;
    readonly unparseData: UnparseArray; 
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
    readonly unparseData: UnparseArray; 
    constructor(body) {
        this.type = Syntax.BlockStatement;
        this.body = body;
    }
}

export class BreakStatement {
    readonly type: string;
    readonly label: Identifier | null;
    readonly unparseData: UnparseArray; 
    constructor(label: Identifier | null) {
        this.type = Syntax.BreakStatement;
        this.label = label;
    }
}

export class CallExpression {
    readonly type: string;
    readonly callee: Expression | Import;
    readonly arguments: ArgumentListElement[];
    readonly unparseData: UnparseArray; 
    constructor(callee: Expression | Import, args: ArgumentListElement[]) {
        this.type = Syntax.CallExpression;
        this.callee = callee;
        this.arguments = args;
    }
}

export class CatchClause {
    readonly type: string;
    readonly param: BindingIdentifier | BindingPattern;
    readonly body: BlockStatement;
    readonly unparseData: UnparseArray; 
    constructor(param: BindingIdentifier | BindingPattern, body: BlockStatement) {
        this.type = Syntax.CatchClause;
        this.param = param;
        this.body = body;
    }
}

export class ClassBody {
    readonly type: string;
    readonly body: Property[];
    readonly unparseData: UnparseArray; 
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
    readonly unparseData: UnparseArray; 
    constructor(id: Identifier | null, superClass: Identifier | null, body: ClassBody) {
        this.type = Syntax.ClassDeclaration;
        this.id = id;
        this.superClass = superClass;
        this.body = body;
    }
}

export class ClassExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly superClass: Identifier | null;
    readonly body: ClassBody;
    readonly unparseData: UnparseArray; 
    constructor(id: Identifier | null, superClass: Identifier | null, body: ClassBody) {
        this.type = Syntax.ClassExpression;
        this.id = id;
        this.superClass = superClass;
        this.body = body;
    }
}

export class ComputedMemberExpression {
    readonly type: string;
    readonly computed: boolean;
    readonly object: Expression;
    readonly property: Expression;
    readonly unparseData: UnparseArray; 
    constructor(object: Expression, property: Expression) {
        this.type = Syntax.MemberExpression;
        this.computed = true;
        this.object = object;
        this.property = property;
    }
}

export class ConditionalExpression {
    readonly type: string;
    readonly test: Expression;
    readonly consequent: Expression;
    readonly alternate: Expression;
    readonly unparseData: UnparseArray; 
    constructor(test: Expression, consequent: Expression, alternate: Expression) {
        this.type = Syntax.ConditionalExpression;
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
}

export class ContinueStatement {
    readonly type: string;
    readonly label: Identifier | null;
    readonly unparseData: UnparseArray; 
    constructor(label: Identifier | null) {
        this.type = Syntax.ContinueStatement;
        this.label = label;
    }
}

export class DebuggerStatement {
    readonly type: string;
    readonly unparseData: UnparseArray; 
    constructor() {
        this.type = Syntax.DebuggerStatement;
    }
}

export class Directive {
    readonly type: string;
    readonly expression: Expression;
    readonly directive: string;
    readonly unparseData: UnparseArray; 
    constructor(expression: Expression, directive: string) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
        this.directive = directive;
    }
}

export class DoWhileStatement {
    readonly type: string;
    readonly body: Statement;
    readonly test: Expression;
    readonly unparseData: UnparseArray; 
    constructor(body: Statement, test: Expression) {
        this.type = Syntax.DoWhileStatement;
        this.body = body;
        this.test = test;
    }
}

export class EmptyStatement {
    readonly type: string;
    readonly unparseData: UnparseArray; 
    constructor() {
        this.type = Syntax.EmptyStatement;
    }
}

export class ExportAllDeclaration {
    readonly type: string;
    readonly source: Literal;
    readonly unparseData: UnparseArray; 
    constructor(source: Literal) {
        this.type = Syntax.ExportAllDeclaration;
        this.source = source;
    }
}

export class ExportDefaultDeclaration {
    readonly type: string;
    readonly declaration: ExportableDefaultDeclaration;
    readonly unparseData: UnparseArray; 
    constructor(declaration: ExportableDefaultDeclaration) {
        this.type = Syntax.ExportDefaultDeclaration;
        this.declaration = declaration;
    }
}

export class ExportNamedDeclaration {
    readonly type: string;
    readonly declaration: ExportableNamedDeclaration | null;
    readonly specifiers: ExportSpecifier[];
    readonly source: Literal | null;
    readonly unparseData: UnparseArray; 
    constructor(declaration: ExportableNamedDeclaration | null, specifiers: ExportSpecifier[], source: Literal | null) {
        this.type = Syntax.ExportNamedDeclaration;
        this.declaration = declaration;
        this.specifiers = specifiers;
        this.source = source;
    }
}

export class ExportSpecifier {
    readonly type: string;
    readonly exported: Identifier;
    readonly local: Identifier;
    readonly unparseData: UnparseArray; 
    constructor(local: Identifier, exported: Identifier) {
        this.type = Syntax.ExportSpecifier;
        this.exported = exported;
        this.local = local;
    }
}

export class ExpressionStatement {
    readonly type: string;
    readonly expression: Expression;
    readonly unparseData: UnparseArray; 
    constructor(expression: Expression) {
        this.type = Syntax.ExpressionStatement;
        this.expression = expression;
    }
}

export class ForInStatement {
    readonly type: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly body: Statement;
    readonly each: boolean;
    readonly unparseData: UnparseArray; 
    constructor(left: Expression, right: Expression, body: Statement) {
        this.type = Syntax.ForInStatement;
        this.left = left;
        this.right = right;
        this.body = body;
        this.each = false;
    }
}

export class ForOfStatement {
    readonly type: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly body: Statement;
    readonly unparseData: UnparseArray; 
    constructor(left: Expression, right: Expression, body: Statement) {
        this.type = Syntax.ForOfStatement;
        this.left = left;
        this.right = right;
        this.body = body;
    }
}

export class ForStatement {
    readonly type: string;
    readonly init: Expression | null;
    readonly test: Expression | null;
    readonly update: Expression | null;
    body: Statement;
    readonly unparseData: UnparseArray; 
    constructor(init: Expression | null, test: Expression | null, update: Expression | null, body: Statement) {
        this.type = Syntax.ForStatement;
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
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
    readonly unparseData: UnparseArray; 
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionDeclaration;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
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
    readonly unparseData: UnparseArray; 
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement, generator: boolean) {
        this.type = Syntax.FunctionExpression;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
        this.expression = false;
        this.async = false;
    }
}

export class Identifier {
    readonly type: string;
    readonly name: string;
    readonly unparseData: UnparseArray; 
    constructor(name) {
        this.type = Syntax.Identifier;
        this.name = name;
    }
}

export class IfStatement {
    readonly type: string;
    readonly test: Expression;
    readonly consequent: Statement;
    readonly alternate: Statement | null;
    readonly unparseData: UnparseArray; 
    constructor(test: Expression, consequent: Statement, alternate: Statement | null) {
        this.type = Syntax.IfStatement;
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
}

export class Import {
    readonly type: string;
    readonly unparseData: UnparseArray; 
    constructor() {
        this.type = Syntax.Import;
    }
}

export class ImportDeclaration {
    readonly type: string;
    readonly specifiers: ImportDeclarationSpecifier[];
    readonly source: Literal;
    readonly unparseData: UnparseArray; 
    constructor(specifiers, source) {
        this.type = Syntax.ImportDeclaration;
        this.specifiers = specifiers;
        this.source = source;
    }
}

export class ImportDefaultSpecifier {
    readonly type: string;
    readonly local: Identifier;
    readonly unparseData: UnparseArray; 
    constructor(local: Identifier) {
        this.type = Syntax.ImportDefaultSpecifier;
        this.local = local;
    }
}

export class ImportNamespaceSpecifier {
    readonly type: string;
    readonly local: Identifier;
    readonly unparseData: UnparseArray; 
    constructor(local: Identifier) {
        this.type = Syntax.ImportNamespaceSpecifier;
        this.local = local;
    }
}

export class ImportSpecifier {
    readonly type: string;
    readonly local: Identifier;
    readonly imported: Identifier;
    readonly unparseData: UnparseArray; 
    constructor(local: Identifier, imported: Identifier) {
        this.type = Syntax.ImportSpecifier;
        this.local = local;
        this.imported = imported;
    }
}

export class LabeledStatement {
    readonly type: string;
    readonly label: Identifier;
    readonly body: Statement;
    readonly unparseData: UnparseArray; 
    constructor(label: Identifier, body: Statement) {
        this.type = Syntax.LabeledStatement;
        this.label = label;
        this.body = body;
    }
}

export class Literal {
    readonly type: string;
    readonly value: boolean | number | string | null;
    readonly raw: string;
    readonly unparseData: UnparseArray; 
    constructor(value: boolean | number | string | null, raw: string) {
        this.type = Syntax.Literal;
        this.value = value;
        this.raw = raw;
    }
}

export class MetaProperty {
    readonly type: string;
    readonly meta: Identifier;
    readonly property: Identifier;
    readonly unparseData: UnparseArray; 
    constructor(meta: Identifier, property: Identifier) {
        this.type = Syntax.MetaProperty;
        this.meta = meta;
        this.property = property;
    }
}

export class MethodDefinition {
    readonly type: string;
    readonly key: Expression | null;
    readonly computed: boolean;
    readonly value: AsyncFunctionExpression | FunctionExpression | null;
    readonly kind: string;
    readonly static: boolean;
    readonly unparseData: UnparseArray; 
    constructor(key: Expression | null, computed: boolean, value: AsyncFunctionExpression | FunctionExpression | null, kind: string, isStatic: boolean) {
        this.type = Syntax.MethodDefinition;
        this.key = key;
        this.computed = computed;
        this.value = value;
        this.kind = kind;
        this.static = isStatic;
    }
}

export class Module {
    readonly type: string;
    readonly body: StatementListItem[];
    readonly sourceType: string;
    readonly unparseData: UnparseArray; 
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
    readonly unparseData: UnparseArray; 
    constructor(callee: Expression, args: ArgumentListElement[]) {
        this.type = Syntax.NewExpression;
        this.callee = callee;
        this.arguments = args;
    }
}

export class ObjectExpression {
    readonly type: string;
    readonly properties: ObjectExpressionProperty[];
    readonly unparseData: UnparseArray; 
    constructor(properties: ObjectExpressionProperty[]) {
        this.type = Syntax.ObjectExpression;
        this.properties = properties;
    }
}

export class ObjectPattern {
    readonly type: string;
    readonly properties: ObjectPatternProperty[];
    readonly unparseData: UnparseArray; 
    constructor(properties: ObjectPatternProperty[]) {
        this.type = Syntax.ObjectPattern;
        this.properties = properties;
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
    readonly unparseData: UnparseArray; 
    constructor(object: Expression, property: Expression) {
        this.type = Syntax.MemberExpression;
        this.computed = false;
        this.object = object;
        this.property = property;
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
