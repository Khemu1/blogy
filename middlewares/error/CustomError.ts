import { NextResponse } from "next/server";

class CustomError extends Error {
  statusCode: number;
  status: string;
  safe: boolean;
  type: string;
  details?: string;
  errors: Record<string, string> = {};

  constructor(
    message: string,
    statusCode: number = 500,
    type: string = "server error",
    safe: boolean = false,
    details?: string,
    errors?: Record<string, string>
  ) {
    super(message);
    this.name = "CustomError"; // inhereted from the Error Class
    Object.setPrototypeOf(this, CustomError.prototype);
    Error.captureStackTrace(this, this.constructor);

    this.statusCode = statusCode;
    this.status = statusCode >= 200 && statusCode < 300 ? "success" : "fail";
    this.safe = safe;
    this.details = details;
    this.type = type;
    this.errors = errors ?? {};
  }
}

const sendDevError = (error: CustomError) => {
  const { statusCode, status, message, stack, type, details, errors } = error;
  return NextResponse.json(
    { message, status, details, statusCode, stack, type, errors },
    { status: statusCode }
  );
};

const sendProdError = (error: CustomError) => {
  const { statusCode, status, message, safe, type, details, errors } = error;

  if (safe) {
    return NextResponse.json(
      { message, status, type, statusCode, details, errors },
      {
        status: statusCode,
      }
    );
  }
  return NextResponse.json(
    {
      message: "Something went wrong",
      statusCode: 500,
      status: "error",
      type,
      errors,
    },
    { status: 500 }
  );
};

export { sendDevError, sendProdError, CustomError };
