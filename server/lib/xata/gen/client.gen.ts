// Generated by Xata Codegen 0.21.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "post",
    columns: [
      { name: "content", type: "text" },
      { name: "authorUser", type: "link", link: { table: "user" } },
      {
        name: "createdAt",
        type: "datetime",
        defaultValue: "2022-11-18T19:35:37.105Z",
      },
      { name: "updatedAt", type: "datetime" },
      { name: "isCommentOf", type: "link", link: { table: "post" } },
      { name: "isDeleted", type: "bool", notNull: true, defaultValue: "false" },
      {
        name: "countTotalComments",
        type: "int",
        notNull: true,
        defaultValue: "0",
      },
      {
        name: "countTotalLikes",
        type: "int",
        notNull: true,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "user",
    columns: [
      { name: "name", type: "string" },
      { name: "handle", type: "string", unique: true },
      { name: "authId", type: "string", unique: true },
      { name: "createdAt", type: "datetime" },
      { name: "updatedAt", type: "datetime" },
    ],
  },
  {
    name: "userFollowing",
    columns: [
      { name: "user", type: "link", link: { table: "user" } },
      { name: "followsUser", type: "link", link: { table: "user" } },
      { name: "createdAt", type: "datetime" },
      { name: "updatedAt", type: "datetime" },
    ],
  },
  {
    name: "postLikes",
    columns: [
      { name: "post", type: "link", link: { table: "post" } },
      { name: "createdAt", type: "datetime" },
      { name: "updatedAt", type: "datetime" },
      { name: "user", type: "link", link: { table: "user" } },
    ],
  },
  {
    name: "bookmarkFolder",
    columns: [
      {
        name: "name",
        type: "string",
        notNull: true,
        defaultValue: "My Bookmarks",
      },
      { name: "user", type: "link", link: { table: "user" } },
      { name: "createdAt", type: "datetime" },
      { name: "updatedAt", type: "datetime" },
      { name: "icon", type: "string", notNull: true, defaultValue: "📚" },
    ],
  },
  {
    name: "postBookmark",
    columns: [
      { name: "post", type: "link", link: { table: "post" } },
      { name: "user", type: "link", link: { table: "user" } },
      {
        name: "bookmarkFolder",
        type: "link",
        link: { table: "bookmarkFolder" },
      },
      { name: "createdAt", type: "datetime" },
      { name: "updatedAt", type: "datetime" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Post = InferredTypes["post"];
export type PostRecord = Post & XataRecord;

export type User = InferredTypes["user"];
export type UserRecord = User & XataRecord;

export type UserFollowing = InferredTypes["userFollowing"];
export type UserFollowingRecord = UserFollowing & XataRecord;

export type PostLikes = InferredTypes["postLikes"];
export type PostLikesRecord = PostLikes & XataRecord;

export type BookmarkFolder = InferredTypes["bookmarkFolder"];
export type BookmarkFolderRecord = BookmarkFolder & XataRecord;

export type PostBookmark = InferredTypes["postBookmark"];
export type PostBookmarkRecord = PostBookmark & XataRecord;

export type DatabaseSchema = {
  post: PostRecord;
  user: UserRecord;
  userFollowing: UserFollowingRecord;
  postLikes: PostLikesRecord;
  bookmarkFolder: BookmarkFolderRecord;
  postBookmark: PostBookmarkRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://hello-s-workspace-8tnf59.eu-west-1.xata.sh/db/twitter-clone",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
