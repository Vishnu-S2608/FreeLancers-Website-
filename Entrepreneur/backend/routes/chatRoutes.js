// routes/chatRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Forward request to Python FastAPI with API key
    const response = await axios.post(
      process.env.PYTHON_API_URL,
      { message },
      {
        headers: { "x-api-key": process.env.PYTHON_API_KEY },
      }
    );

    console.log("Python response:", response.data); // ✅ Add this for debugging


    return res.json(response.data);
  } catch (error) {
    console.error("Error connecting to Python API:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to get response from chatbot" });
  }
});

export default router;
