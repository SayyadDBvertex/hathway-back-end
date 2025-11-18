import mongoose from 'mongoose';
import 'dotenv/config';
const MONGO_URI = process.env.MONGO_URI;

// Check if the URI is actually present (This prevents the 'undefined' error)
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is missing in the environment variables. Please check your .env file.");

}


const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        console.log(" MongoDB successfully connected!");
        
    } catch (error) {
        console.error(" MongoDB Connection FAILED:", error.message);
 
        process.exit(1);
    }
};


export default connectDB;

