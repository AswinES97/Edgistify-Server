import express, { NextFunction, Request, Response } from "express";
import "express-async-errors"
import { configKeys } from "./config/configKeys";
import mainRouter from "./routes";
import expressConfig from "./config/expressConfig";
import { errorHandlingMiddleware, NotFoundError } from "@ticket-common/common";

const API_VERSION = configKeys.API_VERSION;

const app = express();
expressConfig(app, express);

app.use(`/${API_VERSION}`, mainRouter);
app.use("/*", (req: Request, res: Response) => {
  throw new NotFoundError();
});

// custom error handling function from package manually created.
app.use(errorHandlingMiddleware);

export default app;
