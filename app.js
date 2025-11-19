import express from "express";
import cors from "cors";
import connectDB from "./conecction/connection.js";
import formRouter from "./routes/formRouter.js";
import dotenv from "dotenv";



const PORT = 3001;
const app = express();

// Connect Database
connectDB();
dotenv.config();
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
    console.log(`Server Started at http://localhost:${process.env.PORT || PORT}`);
});
