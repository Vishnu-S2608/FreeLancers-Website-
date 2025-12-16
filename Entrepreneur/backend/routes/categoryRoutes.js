import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Normalize helper — used both for checking and saving
const normalizeCategory = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "") // remove non-letter chars
    .replace(/\s+/g, " ");    // compress multiple spaces
};

// 🧠 Add or check category
router.post("/", async (req, res) => {
  try {
    const rawName = req.body.name || "";

    if (!rawName.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const normalized = normalizeCategory(rawName);

    // Check if category already exists by normalized field
    const existing = await Category.findOne({ normalized });

    if (existing) {
      return res.status(200).json({
        message: "Category already exists",
        category: existing,
      });
    }

    // Capitalize each word for display
    const capitalized = normalized.replace(/\b\w/g, (c) => c.toUpperCase());

    const newCategory = new Category({
      name: capitalized,
      normalized,
    });

    await newCategory.save();

    res.status(201).json({
      message: "✅ New category added",
      category: newCategory,
    });
  } catch (error) {
    console.error("❌ Error saving category:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 📦 Get all categories
router.get("/", async (req, res) => {
  try {
    // Sort alphabetically (optional)
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
