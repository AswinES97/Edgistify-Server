import { Request, Response } from "express";
import { ProductModel } from "../model/product.model";

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  let skip = Number(req.query.skip);

  const products = await ProductModel.find().skip(skip).limit(9);
  const productCount = await ProductModel.estimatedDocumentCount();
  const response = { products, productCount };

  res.send(response);
};

export default { getAllProducts };
