import { Request, Response } from "express";
import { UserModel } from "../model/user.model";
import passUtil from "../util/bcrypt";
import { nanoid } from "nanoid";
import { BadRequestError } from "@ticket-common/common";
import jwt from "../util/jwt";

const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, password } = req.body;

  const hasEmail = await UserModel.findOne({ email });
  if (!!hasEmail) throw new BadRequestError("Email Already Exist");

  const passHash = await passUtil.hash(password);
  const userData = await UserModel.create({
    userId: nanoid(),
    fullname,
    email,
    password: passHash,
  });

  res.json(userData);
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
  const token = await jwt.sign(hasUser.userId as string);

  res.json({ token });
};

export default { signup, signin };
