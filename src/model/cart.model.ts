import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    products: [
      {
        productId: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
    // to delete _id, _v, password from return document
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.userId;
      },
    },
  }
);

const cart = mongoose.model("cart", cartSchema);

export { cart as CartModel };
