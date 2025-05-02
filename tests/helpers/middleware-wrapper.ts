import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware"; // Import your middleware
import { createTestRequest } from "./test-utils";

type NextHandler = (req: NextRequest) => Promise<NextResponse>;

export const withMiddleware = async (
  handler: NextHandler,
  req: NextRequest
): Promise<NextResponse> => {

  const req1 = req;
  const req2 = req;

  const middlewareResponse = await middleware(req1);

  if (middlewareResponse && !middlewareResponse.ok) {
    return middlewareResponse;
  }
  return await handler(req2);
};
