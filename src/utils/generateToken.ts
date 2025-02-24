import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

//Generate JWT Token
export function generateJWT(jwtPayload: JWTPayload): string {
  const privateKey = process.env.JWT_SECRET as string;
  const token = jwt.sign(jwtPayload, privateKey, {
    expiresIn: "7d",
  });
  return token;
}

// Set Cookie with JWT
export function setCookie(jwtPaylod: JWTPayload): string {
  const token = generateJWT(jwtPaylod);
  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //development=http,production=hhtps
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, //30 days
  });
  return cookie;
}
