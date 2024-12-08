import jwt, { JwtPayload } from "jsonwebtoken";
import { configKeys } from "../config/configKeys";
import { IJwtPayload } from "../types/types";

const sign = async (payload: IJwtPayload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { data: payload },
      configKeys.JWT_SECRET as string,
      {
        expiresIn: "6h",
      },
      (err, token) => {
        if (err) reject(err.message);
        resolve(token);
      }
    );
  });
};

const verify = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, configKeys.JWT_SECRET as string, (err, decode) => {
      if (err) reject(err.message);
      resolve(decode as JwtPayload | undefined | void);
    });
  });
};

export default {
  sign,
  verify,
};
