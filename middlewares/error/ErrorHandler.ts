import { NextRequest, NextResponse } from "next/server";
import { sendDevError, sendProdError } from "./CustomError";

const errorHandler = (err: any, req: NextRequest) => {
  // if (err instanceof ValidationError) {
  //   return NextResponse.json({
  //     status: "error",
  //     message: err.errors[0].message,
  //   });
  // }
  // don't call sequelize inside middlewares they aren't edge compatible
  const isDev = process.env.NODE_ENV === "development";

  return isDev ? sendDevError(err, req) : sendProdError(err, req);
};

export { errorHandler };
