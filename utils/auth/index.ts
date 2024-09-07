import { JWTPayloadProps } from "@/types";
import { jwtVerify, SignJWT } from "jose"; // will be using jose for validation since runtime edge doesn't support all modules in jsonwebtoken

export const refreshCookieOptions = {
  maxAge: 604800, // 7 days in seconds
  httpOnly: true,
  secure: false,
  path: "/",
  sameSite: "strict" as const,
};

export const accessCookieOptions = {
  maxAge: 3600, // 1h in seconds
  httpOnly: true,
  secure: false,
  path: "/",
  sameSite: "strict" as const,
};

export const requestCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
};

export const generateAccessToken = async (payload: JWTPayloadProps) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("1h")
      .setIssuedAt()
      .sign(secret);

    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

export const generateRefreshToken = async (payload: JWTPayloadProps) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_REFRESH as string);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // Set the protected header
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(secret);
    return token;
  } catch (error) {
    throw new Error("Failed to generate refresh token");
  }
};

export const verifyToken = async (token: string, access: boolean) => {
  try {
    const secret = new TextEncoder().encode(
      access
        ? (process.env.JWT_SECRET as string)
        : (process.env.JWT_REFRESH as string)
    );
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(`${token ? "access token" : "refresh token"}`, error);
    return null;
  }
};

export async function createTokens(id: number) {
  try {
    const accessToken = await generateAccessToken({ id });
    const refreshToken = await generateRefreshToken({ id });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating tokens:", error);
    throw new Error("Token creation failed");
  }
}

export function checkPaylod(
  accessPayload: JWTPayloadProps,
  refreshPayload: JWTPayloadProps
): boolean | number {
  if (
    !accessPayload ||
    !refreshPayload ||
    typeof Number(accessPayload?.id) !== "number" ||
    typeof Number(refreshPayload?.id) !== "number"
  ) {
    return false;
  }
  if (!accessPayload.id !== !refreshPayload.id) {
    return false;
  }
  return accessPayload.id;
}
