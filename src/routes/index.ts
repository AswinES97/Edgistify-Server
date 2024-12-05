import { Router } from "express";
import authRouter from "./auth.routes";

const mainRouter = Router()

mainRouter.use('/auth', authRouter)
// mainRouter.use('/cart', cartRouter)


export default mainRouter;
