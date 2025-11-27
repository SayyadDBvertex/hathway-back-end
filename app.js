import express from "express";
import cors from "cors";
import connectDB from "./conecction/connection.js";
import formRouter from "./routes/formRouter.js";
import dotenv from "dotenv";



const PORT = process.env.PORT || 3025;
const app = express();

// Load environment variables first
dotenv.config();
// Connect Database
connectDB();
// Middlewares
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", formRouter)

// Test Route
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
});
