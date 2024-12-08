import { Request, Response } from "express";
import { CardModel } from "../model/cart.model";

const placeOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  const cartData = await CardModel.aggregate([
    {
      $match: {
        userId,
      },
    },
    {
      $unwind: {
        path: "$products",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "id",
        as: "productDetails",
      },
    },
    {
      $unwind: {
        path: "$productDetails",
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        "products.productId": 1,
        "products.quantity": 1,
        "products.title": "$productDetails.title", // Include product name
        "products.price": "$productDetails.price", // Include product price
      },
    },
    {
      $group: {
        _id: "$_id",
        products: { $push: "$products" },
      },
    },
  ]);

  console.log(cartData[0].products);
};

export default { placeOrder };
