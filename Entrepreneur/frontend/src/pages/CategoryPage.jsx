import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("❌ Failed to fetch categories:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        Choose a Category
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() =>
              navigate(`/freelancers/${encodeURIComponent(cat.name)}`)
            }
            className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:scale-105 hover:shadow-xl transition"
          >
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-xl font-semibold">{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
