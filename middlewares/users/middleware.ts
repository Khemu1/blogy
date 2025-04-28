// middleware.ts or middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  registerSchema,
  validateWithSchema,
  loginSchema,
} from "@/app/utils/user";
import { LoginFormProps, RegisterFormProps } from "@/app/types";

export async function registerMiddleware(req: NextRequest) {
  try {
    const data = (await req.json()) as RegisterFormProps;
    const schema = registerSchema();
    await schema.parseAsync(data);
    return NextResponse.next();
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    console.error(validationErrors);
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: validationErrors,
      },
      { status: 400 }
    );
  }
}

export async function loginMiddleware(req: NextRequest) {
  try {
    const data = (await req.json()) as LoginFormProps;
    const schema = loginSchema();
    await schema.parseAsync(data);
    return NextResponse.next();
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    console.error(validationErrors);
    return NextResponse.json(
      {
        errors: validationErrors,
      },
      { status: 400 }
    );
  }
}
