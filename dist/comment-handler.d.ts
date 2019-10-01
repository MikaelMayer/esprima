import { SourceLocation } from './scanner';
interface Comment {
    type: string;
    value: string;
    range?: [number, number];
    loc?: SourceLocation;
}
interface Entry {
    comment: Comment;
    start: number;
}
interface NodeInfo {
    node: any;
    start: number;
}
export declare class CommentHandler {
    attach: boolean;
    comments: Comment[];
    stack: NodeInfo[];
    leading: Entry[];
    trailing: Entry[];
    constructor();
    insertInnerComments(node: any, metadata: any): void;
    findTrailingComments(metadata: any): Comment[];
    findLeadingComments(metadata: any): Comment[];
    visitNode(node: any, metadata: any): void;
    visitComment(node: any, metadata: any): void;
    visit(node: any, metadata: any): void;
}
export {};
