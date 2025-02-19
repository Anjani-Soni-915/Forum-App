import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CreateUserInput } from "../controller/User/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: CreateUserInput;
    }
  }
}

const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        return res.status(403).send({ message: "Access forbidden" });
      }
      req.user = user as CreateUserInput;
      next();
    });
  } else {
    res.status(401).send({ message: "No token provided" });
  }
};

export default authenticateJWT;
