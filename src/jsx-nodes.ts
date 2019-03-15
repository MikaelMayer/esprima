import { JSXSyntax } from './jsx-syntax';
import * as Node from './nodes';

export type JSXAttributeName = JSXIdentifier | JSXNamespacedName;
export type JSXAttributeValue = Node.Literal | JSXElement | JSXSpreadAttribute | JSXExpressionContainer;
export type JSXChild = JSXElement | JSXExpressionContainer | JSXText;
export type JSXElementAttribute = JSXAttribute | JSXSpreadAttribute;
export type JSXElementName = JSXIdentifier | JSXNamespacedName | JSXMemberExpression;

/* tslint:disable:max-classes-per-file */

export class JSXClosingElement {
    readonly type: string;
    readonly name: JSXElementName;
    readonly wsAfterName: string;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + "</" + Node.unparseChild(this)(this.name) + this.wsAfterName + ">" + this.wsAfter;
    }
    constructor(name: JSXElementName, wsAfterName: string) {
        this.type = JSXSyntax.JSXClosingElement;
        this.name = name;
        this.wsAfterName = wsAfterName;
    }
}

export class JSXElement {
    readonly type: string;
    wsBefore: string = "";
    readonly openingElement: JSXOpeningElement;
    readonly children: JSXChild[];
    readonly closingElement: JSXClosingElement | null;
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + Node.unparseChild(this)(this.openingElement) +
        Node.unparseChildren(this, "")(this.children) +
       (this.closingElement ? Node.unparseChild(this)(this.closingElement) : "") +
       this.wsAfter;        
    }
    constructor(openingElement: JSXOpeningElement, children: JSXChild[], closingElement: JSXClosingElement | null) {
        this.type = JSXSyntax.JSXElement;
        this.openingElement = openingElement;
        this.children = children;
        this.closingElement = closingElement;
    }
}

export class JSXEmptyExpression {
    readonly type: string
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + this.wsAfter;
    }
    constructor() {
        this.type = JSXSyntax.JSXEmptyExpression;
    }
}

export class JSXExpressionContainer {
    readonly type: string;
    readonly expression: Node.Expression | JSXEmptyExpression;
    readonly wsBeforeClosing: string;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + "{" + Node.unparseChild(this)(this.expression) + this.wsBeforeClosing + "}" + this.wsAfter;
    }
    constructor(expression: Node.Expression | JSXEmptyExpression, wsBeforeClosing: string) {
        this.type = JSXSyntax.JSXExpressionContainer;
        this.expression = expression;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class JSXIdentifier {
    readonly type: string;
    readonly name: string;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + this.name + this.wsAfter;
    }
    constructor(name: string) {
        this.type = JSXSyntax.JSXIdentifier;
        this.name = name;
    }
}

export class JSXMemberExpression {
    readonly type: string;
    readonly object: JSXMemberExpression | JSXIdentifier;
    readonly property: JSXIdentifier;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore +
        Node.unparseChild(this)(this.object) + "." +
        Node.unparseChild(this)(this.property) +
        this.wsAfter;
    }
    constructor(object: JSXMemberExpression | JSXIdentifier, property: JSXIdentifier) {
        this.type = JSXSyntax.JSXMemberExpression;
        this.object = object;
        this.property = property;
    }
}

export class JSXAttribute {
    readonly type: string;
    readonly name: JSXAttributeName;
    readonly wsBeforeEq: string;
    readonly value: JSXAttributeValue | null;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore +
        Node.unparseChild(this)(this.name) + this.wsBeforeEq + (this.value ? "=" + Node.unparseChild(this)(this.value): "") +
        this.wsAfter;
    }
    constructor(name: JSXAttributeName, wsBeforeEq: string, value: JSXAttributeValue | null) {
        this.type = JSXSyntax.JSXAttribute;
        this.name = name;
        this.value = value;
        this.wsBeforeEq = wsBeforeEq;
    }
}

export class JSXNamespacedName {
    readonly type: string;
    readonly namespace: JSXIdentifier;
    readonly name: JSXIdentifier;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + Node.unparseChild(this)(this.namespace) + ":" + Node.unparseChild(this)(this.name) +
        this.wsAfter;
    }
    constructor(namespace: JSXIdentifier, name: JSXIdentifier) {
        this.type = JSXSyntax.JSXNamespacedName;
        this.namespace = namespace;
        this.name = name;
    }
}

export class JSXOpeningElement {
    readonly type: string;
    readonly name: JSXElementName;
    readonly selfClosing: boolean;
    readonly attributes: JSXElementAttribute[];
    readonly wsBeforeEnd: string;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore +
        "<" + Node.unparseChild(this)(this.name) +
        Node.unparseChildren(this)(this.attributes) +
        this.wsBeforeEnd + (this.selfClosing ? "/" : "") + ">" +
        this.wsAfter;
    }
    constructor(name: JSXElementName, selfClosing: boolean, attributes: JSXElementAttribute[], wsBeforeEnd: string) {
        this.type = JSXSyntax.JSXOpeningElement;
        this.name = name;
        this.selfClosing = selfClosing;
        this.attributes = attributes;
        this.wsBeforeEnd = wsBeforeEnd;
    }
}

export class JSXSpreadAttribute {
    readonly type: string;
    readonly argument: Node.Expression;
    readonly wsBeforeClosing: string;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + "{..." + Node.unparseChild(this)(this.argument) + this.wsBeforeClosing + "}" + this.wsAfter;
    }
    constructor(argument: Node.Expression, wsBeforeClosing: string) {
        this.type = JSXSyntax.JSXSpreadAttribute;
        this.argument = argument;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}

export class JSXText {
    readonly type: string;
    readonly value: string; // Can be modified
    readonly raw: string;
    readonly originalValue: string;
    wsBefore: string = "";
    wsAfter: string = "";
    unparse(parent?: Node.Unparsable): string {
      return this.wsBefore + (this.value == this.originalValue ? this.raw : this.value) + this.wsAfter;
    }
    constructor(value: string, raw: string) {
        this.type = JSXSyntax.JSXText;
        this.value = value;
        this.originalValue = value;
        this.raw = raw;
    }
}
