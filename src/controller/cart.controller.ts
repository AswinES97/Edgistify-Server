import { Request, Response } from "express";
import { CardModel } from "../model/cart.model";
import { ProductModel } from "../model/product.model";

const getCartItems = async (req: Request, res: Response) => {
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

  res.json(cartData[0].products);
  return;
};

const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.userId;

  const productDetails = await ProductModel.findOne({ id: productId });

  if ((productDetails?.stock as number) < Number(quantity)) {
    res.json({
      status: "Failed",
      message: `Falied to add to Cart as stock is low`,
    });
    return;
  }

  const userCartData = await CardModel.findOne({ userId });

  // checking if already cart for user exist.
  if (userCartData) {
    const doesProductAlreadyExistInCart = userCartData?.products.find(
      (productDetails: any) => productDetails.productId === productId
    );

    if (!!doesProductAlreadyExistInCart) {
      userCartData?.products.map((productDetails: any) => {
        if (productDetails.productId === productId) {
          productDetails.quantity += quantity;
        }
      });
    } else {
      userCartData?.products.push(req.body);
    }

    await userCartData?.save();

    res.json({
      status: "Success",
      message: `Added to Cart`,
    });

    return;
  }

  await CardModel.create({
    userId,
    products: [
      {
        productId,
        quantity: Number(quantity),
      },
    ],
  });

  res.json({
    status: "Success",
    message: `Added to Cart`,
  });

  return;
};

export default {
  getCartItems,
  addToCart,
};
