import mongoose from "mongoose";
import { configKeys } from "./configKeys";
import { DbConnectionError } from "@ticket-common/common";

const connectDb = async () => {
    try {
        await mongoose.connect(configKeys.DB_URL)
    } catch (err) {
        console.log(err)
        throw new DbConnectionError()
    }
};

export default connectDb