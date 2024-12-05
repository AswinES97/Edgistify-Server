import mongoose from "mongoose";
import { configKeys } from "./configKeys";

const connectDb = async () => {
    try {
        await mongoose.connect(configKeys.DB_URL)
    } catch (err) {
        console.log(err)
    }
};

export default connectDb