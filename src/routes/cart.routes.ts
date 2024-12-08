import { Router } from "express";
import cartController from "../controller/cart.controller";

const cartRouter = Router();

cartRouter.route("/")
    .get(cartController.getCartItems)
    .post(cartController.addToCart)

export default cartRouter;
