import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { registerSchema, loginSchema } from "@/app/utils/user";
import { LoginFormProps, RegisterFormProps } from "@/app/types";
import { ZodError } from "zod";
import { CustomError } from "../error/CustomError";
import { validateWithSchema } from "@/app/utils/comment";

export async function registerMiddleware(req: NextRequest) {
  try {
    const data = (await req.json()) as RegisterFormProps;
    const schema = registerSchema();
    await schema.parseAsync(data);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = validateWithSchema(error);
      throw new CustomError(
        "Invalid Register Data",
        400,
        "",
        true,
        "",
        validationErrors
      );
    }
    throw error;
  }
}

export async function loginMiddleware(req: NextRequest) {
  try {
    const data = (await req.json()) as LoginFormProps;
    const schema = loginSchema();
    await schema.parseAsync(data);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = validateWithSchema(error);
      throw new CustomError(
        "Invalid Login Data",
        400,
        "",
        true,
        "",
        validationErrors
      );
    }
    throw error;
  }
}
