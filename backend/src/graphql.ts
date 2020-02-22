
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum TagType {
    General = "General"
}

export abstract class IMutation {
    abstract createClient(phoneNumber: string, name?: string): User | Promise<User>;

    abstract updateClient(id: string, phoneNumber: string, name?: string): User | Promise<User>;
}

export class PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export class Post {
    id: string;
    md5: string;
    user: User;
    width: number;
    height: number;
    sampleWidth: number;
    sampleHeight: number;
    previewWidth: number;
    previewHeight: number;
    imageUrl: string;
    sampleUrl: string;
    previewUrl: string;
    thumbnailUrl: string;
    tags: Tag[];
}

export class PostConnection {
    edges: PostEdge[];
    pageInfo: PageInfo;
}

export class PostEdge {
    node: Post;
    cursor: string;
}

export abstract class IQuery {
    abstract posts(first: number, page?: number, query?: string): PostConnection | Promise<PostConnection>;

    abstract post(id: string): Post | Promise<Post>;

    abstract user(id: string): User | Promise<User>;
}

export class Tag {
    name: string;
    type: TagType;
}

export class User {
    id: string;
    email?: string;
    name?: string;
    phoneNumber?: string;
}

export type DateTime = any;
