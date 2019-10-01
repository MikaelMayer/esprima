import { ErrorHandler } from './error-handler';
import { Token } from './token';
export interface Position {
    line: number;
    column: number;
}
export interface SourceLocation {
    start: Position;
    end: Position;
    source?: string;
}
export interface Comment {
    multiLine: boolean;
    slice: number[];
    range: [number, number];
    loc: SourceLocation;
}
export interface RawToken {
    type: Token;
    wsBefore: string;
    value: string | number;
    pattern?: string;
    flags?: string;
    regex?: RegExp | null;
    octal?: boolean;
    cooked?: string;
    head?: boolean;
    tail?: boolean;
    lineNumber: number;
    lineStart: number;
    start: number;
    end: number;
}
interface ScannerState {
    index: number;
    lineNumber: number;
    lineStart: number;
}
export declare class Scanner {
    readonly source: string;
    readonly errorHandler: ErrorHandler;
    trackComment: boolean;
    isModule: boolean;
    index: number;
    lineNumber: number;
    lineStart: number;
    private curlyStack;
    private readonly length;
    constructor(code: string, handler: ErrorHandler);
    saveState(): ScannerState;
    restoreState(state: ScannerState): void;
    eof(): boolean;
    throwUnexpectedToken(message?: string): never;
    private tolerateUnexpectedToken;
    private skipSingleLineComment;
    private skipMultiLineComment;
    scanComments(): any;
    isFutureReservedWord(id: string): boolean;
    isStrictModeReservedWord(id: string): boolean;
    isRestrictedWord(id: string): boolean;
    private isKeyword;
    private codePointAt;
    private scanHexEscape;
    private scanUnicodeCodePointEscape;
    private getIdentifier;
    private getComplexIdentifier;
    private octalToDecimal;
    private scanIdentifier;
    private scanPunctuator;
    private scanHexLiteral;
    private scanBinaryLiteral;
    private scanOctalLiteral;
    private isImplicitOctalLiteral;
    private scanNumericLiteral;
    private scanStringLiteral;
    private scanTemplate;
    private testRegExp;
    private scanRegExpBody;
    private scanRegExpFlags;
    scanRegExp(wsBefore: string): RawToken;
    lex(wsBefore: string): RawToken;
}
export {};
