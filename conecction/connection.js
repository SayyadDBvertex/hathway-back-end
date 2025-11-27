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

        // Ensure we haven't left a UNIQUE index on the email field which
        // would prevent multiple submissions using same email. Drop it if it exists.
        try {
            const db = mongoose.connection.db;
            const usersCollection = db.collection('users');
            const indexes = await usersCollection.indexes();

            for (const idx of indexes) {
                // Mongoose/Driver returns index.key like { email: 1 }
                if (idx.unique && idx.key && Object.prototype.hasOwnProperty.call(idx.key, 'email')) {
                    console.log(`Dropping unique index on users.${Object.keys(idx.key).join(',')}: ${idx.name}`);
                    await usersCollection.dropIndex(idx.name);
                }
            }
        } catch (dropErr) {
            // If dropping fails, just log it; we don't want to crash the server because of an index issue.
            console.warn('Could not drop unique email index (if any). This is probably fine if it does not exist.', dropErr.message || dropErr);
        }
        
    } catch (error) {
        console.error(" MongoDB Connection FAILED:", error.message);
 
        process.exit(1);
    }
};


export default connectDB;

