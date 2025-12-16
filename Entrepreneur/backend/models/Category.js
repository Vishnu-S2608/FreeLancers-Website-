import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    normalized: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ normalized: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
