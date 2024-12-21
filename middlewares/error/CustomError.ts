import { NextRequest, NextResponse } from "next/server";

class CustomError extends Error {
  message: string;
  statusCode: number;
  status: string;
  details?: string;
  trusted?: boolean = false;
  constructor(
    message: string,
    statusCode: number,
    details?: string,
    trusted?: boolean
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.details = details;
    this.trusted = trusted;
    Object.setPrototypeOf(this, CustomError.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

const sendDevError = (error: CustomError, req: NextRequest) => {
  const { statusCode = 500, status = "error", message, stack, details } = error;
  return NextResponse.json(
    { message, status, details, stack },
    { status: statusCode }
  );
};

const sendProdError = (error: CustomError, req: NextRequest) => {
  const { statusCode = 500, status = "error", message, trusted } = error;
  return trusted
    ? NextResponse.json({ message, status }, { status: statusCode })
    : NextResponse.json(
        { message: "Something went wrong", status: "error" },
        { status: 500 }
      );
};

export { sendDevError, sendProdError, CustomError };
