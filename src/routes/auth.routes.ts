import { Router } from "express";
import userController from "../controller/user.controller";
import reqValidator from "../util/validator";

const authRouter = Router();

authRouter.post("/signup",[
    reqValidator.email(),
    reqValidator.fullname(),
    reqValidator.password(),
    reqValidator.validatorFn
], userController.signup);

authRouter.post("/signin",[
    reqValidator.email(),
    reqValidator.password(),
    reqValidator.validatorFn
], userController.signin);

export default authRouter;
