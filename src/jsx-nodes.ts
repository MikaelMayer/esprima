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
    wsBefore: string = '';
    wsAfter: string = '';
    constructor(name: JSXElementName, wsAfterName: string) {
        this.type = JSXSyntax.JSXClosingElement;
        this.name = name;
        this.wsAfterName = wsAfterName;
    }
}
var unparseJSXClosingElement = function(e: JSXClosingElement, parent?: Node.Unparsable): string {
      return e.wsBefore + '</' + Node.unparseChild(e)(e.name) + e.wsAfterName + '>' + e.wsAfter;
    }


export class JSXElement {
    readonly type: string;
    readonly openingElement: JSXOpeningElement;
    readonly children: JSXChild[];
    readonly closingElement: JSXClosingElement | null;
    readonly wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, openingElement: JSXOpeningElement, children: JSXChild[], closingElement: JSXClosingElement | null) {
        this.type = JSXSyntax.JSXElement;
        this.openingElement = openingElement;
        this.children = children;
        this.closingElement = closingElement;
        this.wsBefore = wsBefore;
    }
}
var unparseJSXElement = function(e: JSXElement, parent?: Node.Unparsable): string {
      return e.wsBefore + Node.unparseChild(e)(e.openingElement) +
        Node.unparseChildren(e, '')(e.children) +
       (e.closingElement ? Node.unparseChild(e)(e.closingElement) : '') +
       e.wsAfter;
    }


export class JSXEmptyExpression {
    readonly type: string;
    readonly wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string) {
        this.type = JSXSyntax.JSXEmptyExpression;
        this.wsBefore = wsBefore;
    }
}
var unparseJSXEmptyExpression = function(e: JSXEmptyExpression, parent?: Node.Unparsable): string {
      return e.wsBefore + e.wsAfter;
    }


export class JSXExpressionContainer {
    readonly type: string;
    readonly expression: Node.Expression | JSXEmptyExpression;
    readonly wsBeforeClosing: string;
    readonly wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, expression: Node.Expression | JSXEmptyExpression, wsBeforeClosing: string) {
        this.type = JSXSyntax.JSXExpressionContainer;
        this.expression = expression;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseJSXExpressionContainer = function(e: JSXExpressionContainer, parent?: Node.Unparsable): string {
      return e.wsBefore + '{' + Node.unparseChild(e)(e.expression) + e.wsBeforeClosing + '}' + e.wsAfter;
    }


export class JSXIdentifier {
    readonly type: string;
    readonly name: string;
    readonly wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, name: string) {
        this.type = JSXSyntax.JSXIdentifier;
        this.wsBefore = wsBefore;
        this.name = name;
    }
}
var unparseJSXIdentifier = function(e: JSXIdentifier, parent?: Node.Unparsable): string {
      return e.wsBefore + e.name + e.wsAfter;
    }


export class JSXMemberExpression {
    readonly type: string;
    readonly object: JSXMemberExpression | JSXIdentifier;
    readonly property: JSXIdentifier;
    wsBefore: string = '';
    wsAfter: string = '';
    constructor(object: JSXMemberExpression | JSXIdentifier, property: JSXIdentifier) {
        this.type = JSXSyntax.JSXMemberExpression;
        this.object = object;
        this.property = property;
    }
}
var unparseJSXMemberExpression = function(e: JSXMemberExpression, parent?: Node.Unparsable): string {
      return e.wsBefore +
        Node.unparseChild(e)(e.object) + '.' +
        Node.unparseChild(e)(e.property) +
        e.wsAfter;
    }


export class JSXAttribute {
    readonly type: string;
    readonly name: JSXAttributeName;
    readonly wsBeforeEq: string;
    readonly value: JSXAttributeValue | null;
    readonly wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, name: JSXAttributeName, wsBeforeEq: string, value: JSXAttributeValue | null) {
        this.type = JSXSyntax.JSXAttribute;
        this.name = name;
        this.value = value;
        this.wsBefore = wsBefore;
        this.wsBeforeEq = wsBeforeEq;
    }
}
var unparseJSXAttribute = function(e: JSXAttribute, parent?: Node.Unparsable): string {
      return e.wsBefore +
        Node.unparseChild(e)(e.name) + e.wsBeforeEq + (e.value ? '=' + Node.unparseChild(e)(e.value) : '') +
        e.wsAfter;
    }


export class JSXNamespacedName {
    readonly type: string;
    readonly namespace: JSXIdentifier;
    readonly name: JSXIdentifier;
    wsBefore: string = '';
    wsAfter: string = '';
    constructor(namespace: JSXIdentifier, name: JSXIdentifier) {
        this.type = JSXSyntax.JSXNamespacedName;
        this.namespace = namespace;
        this.name = name;
    }
}
var unparseJSXNamespacedName = function(e: JSXNamespacedName, parent?: Node.Unparsable): string {
      return e.wsBefore + Node.unparseChild(e)(e.namespace) + ':' + Node.unparseChild(e)(e.name) +
        e.wsAfter;
    }


export class JSXOpeningElement {
    readonly type: string;
    readonly name: JSXElementName;
    readonly selfClosing: boolean;
    readonly attributes: JSXElementAttribute[];
    readonly wsBefore: string;
    readonly wsBeforeEnd: string;
    readonly wsBeforeGt: string;
    wsAfter: string = '';
    constructor(wsBefore: string, name: JSXElementName, selfClosing: boolean, attributes: JSXElementAttribute[], wsBeforeEnd: string, wsBeforeGt: string) {
        this.type = JSXSyntax.JSXOpeningElement;
        this.name = name;
        this.selfClosing = selfClosing;
        this.attributes = attributes;
        this.wsBefore = wsBefore;
        this.wsBeforeEnd = wsBeforeEnd;
        this.wsBeforeGt = wsBeforeGt;
    }
}
var unparseJSXOpeningElement = function(e: JSXOpeningElement, parent?: Node.Unparsable): string {
      return e.wsBefore +
        '<' + Node.unparseChild(e)(e.name) +
        Node.unparseChildren(e)(e.attributes) +
        e.wsBeforeEnd + (e.selfClosing ? '/' : '') + e.wsBeforeGt + '>' +
        e.wsAfter;
    }


export class JSXSpreadAttribute {
    readonly type: string;
    readonly argument: Node.Expression;
    readonly wsBeforeClosing: string;
    readonly wsBefore: string;
    wsAfter: string = '';
    constructor(wsBefore: string, argument: Node.Expression, wsBeforeClosing: string) {
        this.type = JSXSyntax.JSXSpreadAttribute;
        this.argument = argument;
        this.wsBefore = wsBefore;
        this.wsBeforeClosing = wsBeforeClosing;
    }
}
var unparseJSXSpreadAttribute = function(e: JSXSpreadAttribute, parent?: Node.Unparsable): string {
      return e.wsBefore + '{...' + Node.unparseChild(e)(e.argument) + e.wsBeforeClosing + '}' + e.wsAfter;
    }


export class JSXText {
    readonly type: string;
    readonly value: string; // Can be modified
    readonly raw: string;
    readonly originalValue: string;
    wsBefore: string = '';
    wsAfter: string = '';
    constructor(value: string, raw: string) {
        this.type = JSXSyntax.JSXText;
        this.value = value;
        this.originalValue = value;
        this.raw = raw;
    }
}
var unparseJSXText = function(e: JSXText, parent?: Node.Unparsable): string {
      return e.wsBefore + (e.value === e.originalValue ? e.raw : e.value) + e.wsAfter;
    }

Node.unparsers[JSXSyntax.JSXClosingElement] = unparseJSXClosingElement;
Node.unparsers[JSXSyntax.JSXElement] = unparseJSXElement;
Node.unparsers[JSXSyntax.JSXEmptyExpression] = unparseJSXEmptyExpression;
Node.unparsers[JSXSyntax.JSXExpressionContainer] = unparseJSXExpressionContainer;
Node.unparsers[JSXSyntax.JSXIdentifier] = unparseJSXIdentifier;
Node.unparsers[JSXSyntax.JSXMemberExpression] = unparseJSXMemberExpression;
Node.unparsers[JSXSyntax.JSXAttribute] = unparseJSXAttribute;
Node.unparsers[JSXSyntax.JSXNamespacedName] = unparseJSXNamespacedName;
Node.unparsers[JSXSyntax.JSXOpeningElement] = unparseJSXOpeningElement;
Node.unparsers[JSXSyntax.JSXSpreadAttribute] = unparseJSXSpreadAttribute;
Node.unparsers[JSXSyntax.JSXText] = unparseJSXText;
