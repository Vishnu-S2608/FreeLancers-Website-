import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import bookingRoutes from "./routes/bookingroutes.js";
import CategoryRoutes from "./routes/categoryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";



// Load environment variables
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => res.send("Freelancer API is running ✅"));

// API routes
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/categories", CategoryRoutes); // 👈 Add this line
app.use("/api/chat", chatRoutes);
app.use("/api/otp", otpRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
