import mongoose from "mongoose";

const connectMongoDB = async () =>  {
    try{
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connect to MongoDB");
} catch (error) {
    console.log("Eroor connecting to MongoDB",error.message)
}
};

export default connectMongoDB;