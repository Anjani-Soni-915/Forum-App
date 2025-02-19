import jwt from "jsonwebtoken";
import { Request } from "express";
import { CreateUserInput } from "../controller/User/user.interface";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateJWT = (req: Request): CreateUserInput | null => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.error("No Bearer token provided.");
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, JWT_SECRET) as CreateUserInput;
    return user;
  } catch (err: any) {
    console.error("Invalid Token:", err.message);
    return null;
  }
};
