import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.set("strictQuery", false)
    return mongoose.connect(process.env.MONGODB_CNN)
};

export default dbConnection;