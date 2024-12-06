import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    price: Number,
    description: String,
    rating: Number,
    stock: Number,
    brand: String,
    images: [String],
    thumbnail: String,
  },
  {
    timestamps: true,
    // to delete _id, _v, password from return document
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

const product = mongoose.model("product", productSchema);

export { product as ProductModel };
