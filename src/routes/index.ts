import { Router } from "express";
import authRouter from "./auth.routes";
import productRouter from "./product.routes";

const mainRouter = Router()

mainRouter.use('/auth', authRouter)
mainRouter.use('/products', productRouter)
// mainRouter.use('/cart', cartRouter)


export default mainRouter;
