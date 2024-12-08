import { Router } from "express";
import orderController from "../controller/order.controller";

const orderRouter = Router();

orderRouter.post("/", orderController.placeOrder);

export default orderRouter;
