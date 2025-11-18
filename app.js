import express from "express";
import cors from "cors";
import connectDB from "./conecction/connection.js";
import formRouter from "./routes/formRouter.js";

const PORT = 3001;
const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
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
