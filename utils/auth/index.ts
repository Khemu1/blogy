import jwt from "jsonwebtoken";

export const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60, // 7 days
  httpOnly: true,
  path: "/",
  sameSite: "strict" as const,
};

export const generateAccessToken = (payload: object) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  return token;
};

export const generateRefreshToken = (payload: object) => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH as string, {
    expiresIn: "7d",
  });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as object;
  } catch (error) {
    return null;
  }
};

export async function createTokens(id: number) {
  try {
    const accessToken = generateAccessToken({ id });
    const refreshToken = generateRefreshToken({ id });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating tokens:", error);
    throw new Error("Token creation failed");
  }
}
