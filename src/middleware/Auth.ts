import { NextFunction, Request, Response } from "express";
import jwt from "../util/jwt";
import { UnauthorizedError } from "@ticket-common/common";
import { JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) throw new UnauthorizedError("No Token Provided");

  await jwt
    .verify(token)
    .then((payload: any) => {
      req.user = payload?.data;
    })
    .catch((err) => {
      // 401 error thrown handled by error handling middleware
      throw new UnauthorizedError("Your Session Expired");
    });

  next();
};
