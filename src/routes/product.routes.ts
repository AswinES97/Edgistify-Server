import { Router } from "express";
import productController from "../controller/product.controller";

const productRouter = Router();

productRouter.get("/", productController);

export default productRouter;
