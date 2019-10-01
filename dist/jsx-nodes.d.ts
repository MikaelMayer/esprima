import * as Node from './nodes';
export declare type JSXAttributeName = JSXIdentifier | JSXNamespacedName;
export declare type JSXAttributeValue = Node.Literal | JSXElement | JSXSpreadAttribute | JSXExpressionContainer;
export declare type JSXChild = JSXElement | JSXExpressionContainer | JSXText;
export declare type JSXElementAttribute = JSXAttribute | JSXSpreadAttribute;
export declare type JSXElementName = JSXIdentifier | JSXNamespacedName | JSXMemberExpression;
export declare class JSXClosingElement {
    readonly type: string;
    readonly name: JSXElementName;
    readonly wsAfterName: string;
    wsBefore: string;
    wsAfter: string;
    constructor(name: JSXElementName, wsAfterName: string);
}
export declare class JSXElement {
    readonly type: string;
    readonly openingElement: JSXOpeningElement;
    readonly children: JSXChild[];
    readonly closingElement: JSXClosingElement | null;
    readonly wsBefore: string;
    wsAfter: string;
    constructor(wsBefore: string, openingElement: JSXOpeningElement, children: JSXChild[], closingElement: JSXClosingElement | null);
}
export declare class JSXEmptyExpression {
    readonly type: string;
    readonly wsBefore: string;
    wsAfter: string;
    constructor(wsBefore: string);
}
export declare class JSXExpressionContainer {
    readonly type: string;
    readonly expression: Node.Expression | JSXEmptyExpression;
    readonly wsBeforeClosing: string;
    readonly wsBefore: string;
    wsAfter: string;
    constructor(wsBefore: string, expression: Node.Expression | JSXEmptyExpression, wsBeforeClosing: string);
}
export declare class JSXIdentifier {
    readonly type: string;
    readonly name: string;
    readonly wsBefore: string;
    wsAfter: string;
    constructor(wsBefore: string, name: string);
}
export declare class JSXMemberExpression {
    readonly type: string;
    readonly object: JSXMemberExpression | JSXIdentifier;
    readonly property: JSXIdentifier;
    wsBefore: string;
    wsAfter: string;
    constructor(object: JSXMemberExpression | JSXIdentifier, property: JSXIdentifier);
}
export declare class JSXAttribute {
    readonly type: string;
    readonly name: JSXAttributeName;
    readonly wsBeforeEq: string;
    readonly value: JSXAttributeValue | null;
    readonly wsBefore: string;
    wsAfter: string;
    constructor(wsBefore: string, name: JSXAttributeName, wsBeforeEq: string, value: JSXAttributeValue | null);
}
export declare class JSXNamespacedName {
    readonly type: string;
    readonly namespace: JSXIdentifier;
    readonly name: JSXIdentifier;
    wsBefore: string;
    wsAfter: string;
    constructor(namespace: JSXIdentifier, name: JSXIdentifier);
}
export declare class JSXOpeningElement {
    readonly type: string;
    readonly name: JSXElementName;
    readonly selfClosing: boolean;
    readonly attributes: JSXElementAttribute[];
    readonly wsBefore: string;
    readonly wsBeforeEnd: string;
    readonly wsBeforeGt: string;
    wsAfter: string;
    constructor(wsBefore: string, name: JSXElementName, selfClosing: boolean, attributes: JSXElementAttribute[], wsBeforeEnd: string, wsBeforeGt: string);
}
export declare class JSXSpreadAttribute {
    readonly type: string;
    readonly argument: Node.Expression;
    readonly wsBeforeClosing: string;
    readonly wsBefore: string;
    wsAfter: string;
    constructor(wsBefore: string, argument: Node.Expression, wsBeforeClosing: string);
}
export declare class JSXText {
    readonly type: string;
    readonly value: string;
    readonly raw: string;
    readonly originalValue: string;
    wsBefore: string;
    wsAfter: string;
    constructor(value: string, raw: string);
}
