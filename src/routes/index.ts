import { Router } from "express";
import authRouter from "./auth.routes";
import productRouter from "./product.routes";
import cartRouter from "./cart.routes";
import { authMiddleware } from "../middleware/Auth";
import orderRouter from "./order.routes";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/cart", [authMiddleware], cartRouter);
mainRouter.use("/order", [authMiddleware], orderRouter);

export default mainRouter;
