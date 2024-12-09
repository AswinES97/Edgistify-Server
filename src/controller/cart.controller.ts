import { Request, Response } from "express";
import { CartModel } from "../model/cart.model";
import { ProductModel } from "../model/product.model";

const getCartItems = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const cartItems = await CartModel.findOne({ userId });
  if (cartItems?.products.length === 0) {
    res.json({
      status: "Success",
      message: "No Items in Cart",
      data: [],
    });
    return;
  }

  const cartData = await CartModel.aggregate([
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

  res.json({
    status: "Success",
    message: "No Items in Cart",
    data: cartData[0].products,
  });
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

  const userCartData = await CartModel.findOne({ userId });

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
};

export default {
  getCartItems,
  addToCart,
};
