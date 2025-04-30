import Upload from "@/db/models/Upload";

export enum ROLES {
  ADMIN = "admin",
  USER = "user",
}
export interface RegisterFormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormProps {
  emailOrUsername: string;
  password: string;
}
export interface MyInfoProps extends UserProps {
  Blogs: BlogProps[];
  comments: CommentProps[];
}
export interface NewUserProps {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface UserProps {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId?: ROLES;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface NewBlogProp {
  title: string;
  content: string;
  imageId: string | null;
}
export interface EditBlogProp {
  title?: string;
  content?: string;
}

export interface BlogProps {
  id: number;
  userId: number;
  title: string;
  content: string;
  image: Upload | null;
  createdAt: Date;
  updatedAt: Date;
  user: { username: string };
  comments: CommentProps[];
}
export interface updateBlogParams {
  title: string;
  content: string;
}
export interface MyProfileBlogs {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface AllBlogProps {
  id: number;
  userId: number;
  title: string;
  content: string;
  image: Upload | null;
  author: string;
  createdAt: string;
  updatedAt: string;
  user: { username: string };
}

export interface LoginErrorProps {
  message?: string;
  emailOrUsername?: string;
  password?: string;
}
export interface RegisterErrorProps {
  message?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface BlogErrorProps {
  message?: string;
  title?: string;
  content?: string;
}

export interface NewCommentProps {
  content: string;
}

export interface CommentProps {
  id: number;
  userId: number;
  blogId: number;
  content: string;
  user: { username: string };
}
export interface MyProfileComments {
  id: number;
  blogId: number;
  content: string;
}
export interface CommentErrorProps {
  message?: string;
  content?: string;
}

export interface JWTPayloadProps {
  [key: string]: any; // Allows any string key with a value of any type
}
export interface TOKENProps {
  id: number;
  exp: number;
  iat: number;
}

export type SearchParams = {
  q?: string | null;
  searchBy?: string | null;
  sortBy?: string | null;
};

export interface UserModel {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface BlogModel {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CommentModel {
  id: number;
  userId: number;
  blogId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
