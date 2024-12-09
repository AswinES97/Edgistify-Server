import { Request, Response } from "express";
import { UserModel } from "../model/user.model";
import passUtil from "../util/bcrypt";
import { nanoid } from "nanoid";
import { BadRequestError } from "@ticket-common/common";
import jwt from "../util/jwt";
import { IJwtPayload } from "../types/types";
import { CartModel } from "../model/cart.model";

const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, password } = req.body;

  const hasEmail = await UserModel.findOne({ email });
  if (!!hasEmail) throw new BadRequestError("Email Already Exist");

  const passHash = await passUtil.hash(password);
  const userId = nanoid()
  await UserModel.create({
    userId,
    fullname,
    email,
    password: passHash,
  });

  await CartModel.create({
    userId,
  })

  res.status(201).json({
    status: "Success",
    message: "Registered Successfully",
  });
};

const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const hasUser = await UserModel.findOne({ email });
  if (!hasUser) throw new BadRequestError("Email and Password do not match!");

  const passCheck = await passUtil.compare(
    password,
    hasUser!.password as string
  );

  if (!passCheck) throw new BadRequestError("Email and Password do not match!");

  const jwtPayload: IJwtPayload = {
    userId: hasUser.userId as string,
    fullname: hasUser.fullname as string,
  };

  const token = await jwt.sign(jwtPayload);

  res.json({ status: "Success", message: "SignIn Success", token });
};

export default { signup, signin };
