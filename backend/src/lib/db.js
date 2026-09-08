import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDb = async() => {
    try {
        const connectDB = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected!!");
    } catch(error){
        console.log("Error While Connecting to MongoDb" , error.message);
    }
}
