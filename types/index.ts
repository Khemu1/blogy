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

export interface UserProps {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface NewBlogProp {
  title: string;
  content: string;
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
}

export interface CommentErrorProps {
  message: string;
}

export interface JWTPayloadProps {
  [key: string]: any; // Allows any string key with a value of any type
}
export interface TOKENProps {
  id: number;
  exp: number;
  iat: number;
}

export interface ReturnedBlogProps {
  blogData: BlogProps;
  comments: CommentProps;
}
