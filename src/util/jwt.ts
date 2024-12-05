import jwt from "jsonwebtoken";
import { configKeys } from "../config/configKeys";

const sign = async (payload: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: payload },
      configKeys.JWT_SECRET as string,
      {},
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
      resolve(decode);
    });
  });
};

export default {
  sign,
  verify,
};
