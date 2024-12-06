import { Request, Response } from "express";
import { ProductModel } from "../model/product.model";

const productController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await ProductModel.find().limit(10);
  res.send(products)
};

export default productController;
