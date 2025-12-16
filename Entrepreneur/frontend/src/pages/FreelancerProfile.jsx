// src/pages/FreelancerProfile.jsx
import { useState } from "react";
import { FaUserEdit, FaSave } from "react-icons/fa";

export default function FreelancerProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    skills: "React, Node.js, UI/UX",
    category: "Technical",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaUserEdit className="text-indigo-600 w-6 h-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Edit Profile
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Skills</span>
            </label>
            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Category</span>
            </label>
            <select
              name="category"
              value={profile.category}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option>Technical</option>
              <option>Non-Technical</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <FaSave /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
