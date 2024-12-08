import { Application } from "express";
import { expressType, IJwtPayload } from "../types/types";
import { configKeys } from "./configKeys";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    data: IJwtPayload;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IJwtPayload;
  }
}

export const expressConfig = (app: Application, express: expressType): void => {
  if (configKeys.NODE_ENV !== "test" && configKeys.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://edgistify.aswines.online"],
      credentials: true,
    })
  );
  // compression is not automatically enabled
  // so compression middleware enables any alogritham supported by browser
  app.use(compression());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // helmet to secure the app by setting various HTTP headers
  app.use(helmet({ xssFilter: true }));
};

export default expressConfig;
