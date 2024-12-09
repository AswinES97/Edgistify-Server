import { Request, Response } from "express";
import { CartModel } from "../model/cart.model";
import { OrderModel } from "../model/order.model";
import { nanoid } from "nanoid";
import { ProductModel } from "../model/product.model";
import mongoose from "mongoose";

const placeOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

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
      $addFields: {
        isStockAvailable: {
          $gte: ["$productDetails.stock", "$products.quantity"], // Check stock availability
        },
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        "products.productId": 1,
        "products.quantity": 1,
        "products.title": "$productDetails.title",
        "products.price": "$productDetails.price",
        "products.stock": "$productDetails.stock",
        "products.isStockAvailable": "$isStockAvailable",
      },
    },
    {
      $group: {
        _id: "$_id",
        products: { $push: "$products" },
      },
    },
  ]);

  const products = cartData[0].products;
  const noStockItems = products.filter(
    (product: any) => product.isStockAvailable === false
  );

  if (noStockItems.length > 0) {
    res.json({
      status: "Error",
      message: "Cannot process order, Some low for some items.",
      data: noStockItems,
    });
    return;
  }

  // order processing
  let totalPrice = 0;

  const productsArray = products.map((product: any) => {
    const curPrice = Math.ceil(product.price * 84.67) * product.quantity;

    totalPrice += curPrice;
    return {
      productId: product.productId,
      quantity: product.quantity,
      purchasePrice: curPrice,
    };
  });

  const order = {
    orderId: nanoid(),
    userId,
    products: productsArray,
    totalPrice: totalPrice,
    shippingAddress: "hello",
  };

  const bulkOperations = products.map((item: any) => ({
    updateOne: {
      filter: { id: item.productId }, // Match product by ID
      update: { $inc: { stock: -item.quantity } }, // Decrement stock
    },
  }));

  const session = await mongoose.startSession();

  await OrderModel.create([order], { session });
  await ProductModel.bulkWrite(bulkOperations, { session });
  await CartModel.updateOne(
    { userId },
    {
      $set: {
        products: [],
      },
    }
  );

  res.json({
    status: "Success",
    message: "Order Placed",
  });
};

export default { placeOrder };
