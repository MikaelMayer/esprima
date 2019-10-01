import * as JSXNode from './jsx-nodes';
import * as Node from './nodes';
import { Marker, Parser } from './parser';
import { Token } from './token';
interface MetaJSXElement {
    node: Marker;
    opening: JSXNode.JSXOpeningElement;
    closing: JSXNode.JSXClosingElement | null;
    children: JSXNode.JSXChild[];
}
declare const enum JSXToken {
    Identifier = 100,
    Text = 101
}
interface RawJSXToken {
    type: Token | JSXToken;
    value: string;
    lineNumber: number;
    lineStart: number;
    start: number;
    end: number;
    wsBefore: string;
}
interface WSNode {
    wsBefore: string;
    node: Marker;
}
export declare class JSXParser extends Parser {
    constructor(code: string, options: any, delegate: any);
    parsePrimaryExpression(): Node.Expression;
    startJSX(): void;
    finishJSX(): void;
    reenterJSX(): string;
    createJSXNode(): WSNode;
    createJSXChildNode(): Marker;
    scanXHTMLEntity(quote: string): string;
    lexJSX(wsBefore: string): RawJSXToken;
    nextJSXToken(): RawJSXToken;
    nextJSXText(): RawJSXToken;
    peekJSXToken(): RawJSXToken;
    expectJSX(value: any): string;
    matchJSX(value: any): boolean;
    parseJSXIdentifier(wsBefore?: string): JSXNode.JSXIdentifier;
    parseJSXElementName(): JSXNode.JSXElementName;
    parseJSXAttributeName(): JSXNode.JSXAttributeName;
    parseJSXStringLiteralAttribute(): Node.Literal;
    parseJSXExpressionAttribute(): JSXNode.JSXExpressionContainer;
    parseJSXAttributeValue(): JSXNode.JSXAttributeValue;
    parseJSXNameValueAttribute(): JSXNode.JSXAttribute;
    parseJSXSpreadAttribute(): JSXNode.JSXSpreadAttribute;
    parseJSXAttributes(): JSXNode.JSXElementAttribute[];
    parseJSXOpeningElement(): JSXNode.JSXOpeningElement;
    parseJSXBoundaryElement(): JSXNode.JSXOpeningElement | JSXNode.JSXClosingElement;
    parseJSXEmptyExpression(): JSXNode.JSXEmptyExpression;
    parseJSXExpressionContainer(): JSXNode.JSXExpressionContainer;
    parseJSXChildren(): JSXNode.JSXChild[];
    parseComplexJSXElement(el: MetaJSXElement): MetaJSXElement;
    parseJSXElement(wsBefore?: string): JSXNode.JSXElement;
    parseJSXRoot(): JSXNode.JSXElement;
    isStartOfExpression(): boolean;
}
export {};
