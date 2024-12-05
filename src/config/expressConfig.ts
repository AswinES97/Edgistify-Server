import { Application } from "express";
import { expressType } from "../types/types";
import { configKeys } from "./configKeys";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

export const expressConfig = (app: Application, express: expressType): void => {
  if (configKeys.NODE_ENV !== "test" && configKeys.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }
//   app.set("trust proxy", 1);
  app.use(
    cors({
      origin: ["http://localhost:4200"],
      credentials: true,
    })
  );
  // compression is not automatically enabled
  // so compression middleware enables any alogritham supported by browser
  app.use(compression());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // for sanitizing incoming data for mongodb security
  //   app.use(
  //     mongoSanitize({
  //       allowDots: true,
  //     })
  //   );
  // helmet to secure the app by setting various HTTP headers
  app.use(helmet({ xssFilter: true }));

  // for session storage
  // const redisClient = connectRedis() as RedisClientType

  // const redisStore = new RedisStore({
  //   client: redisClient,
  //   prefix: 'ticketing:',
  //   ttl: 60 * 60 * 24 * 15 // 15 days same as refresh token in browser
  // })

  // Make secret stronger and move it to env/K8s-config
  // app.use(
  //   session({
  //     secret: 'keyboard cat',
  //     resave: false,
  //     saveUninitialized: false,
  //     store: redisStore,
  //     cookie: {
  //       sameSite: configKeys.NODE_ENV === 'Production' ? 'strict' : 'lax',
  //       httpOnly: true,
  //       secure: configKeys.NODE_ENV === 'Production'
  //     }
  //   })
  // )
};

export default expressConfig;
