import { NextRequest } from "next/server";
import { CustomError, sendDevError, sendProdError } from "./CustomError";

const errorHandler = (err: any, _req: NextRequest) => {
  const customErr =
    err instanceof CustomError
      ? err
      : new CustomError(
          (err as Error)?.message || "Unknown error", // message
          500,
          "server error",
          false,
          undefined,
          {}
        );
  console.log("custerr", customErr);
  // don't call sequelize inside middlewares they aren't edge compatible
  const isDev = process.env.NODE_ENV === "development";
  return sendDevError(customErr);

  // return isDev ? sendDevError(customErr) : sendProdError(customErr);
};

export { errorHandler };
