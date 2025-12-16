import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function OTPVerification() {
  const [category, setCategory] = useState(""); // Technical / Non-Technical
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [idProof, setIdProof] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Step 1=Category, Step 2=Mobile, Step 3=OTP
  const navigate = useNavigate();

  const DEFAULT_OTP = "123456";

  const handleCategorySelect = (selected) => {
    setCategory(selected);
    setStep(2);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (/^[0-9]{10}$/.test(mobile)) {
      setError("");
      alert(`📲 OTP sent to ${mobile} (Demo OTP: ${DEFAULT_OTP})`);
      setStep(3);
    } else {
      setError("Enter a valid 10-digit mobile number.");
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();

    if (otp !== DEFAULT_OTP) {
      setError("❌ Invalid OTP. Try again.");
      return;
    }

    if (category === "non-technical" && !idProof) {
      setError("⚠️ Please upload ID Proof for non-technical services.");
      return;
    }

    setError("");
    alert("✅ Verification Successful!");
    navigate("/freelancer-signup", { state: { category, mobile } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {step === 1
            ? "Choose Your Path"
            : step === 2
            ? "Mobile Verification"
            : "OTP Verification"}
        </h2>

        {/* Step 1: Category */}
        {step === 1 && (
          <div className="space-y-4 text-center">
            <p className="text-gray-600 mb-4">
              Welcome! Before we get started, select your field to verify your profile securely.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => handleCategorySelect("technical")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Technical
              </button>
              <button
                onClick={() => handleCategorySelect("non-technical")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              >
                Non-Technical
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Mobile */}
        {step === 2 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary w-full hover:scale-105 transition-transform"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 3: OTP + ID */}
        {step === 3 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered w-full"
              required
            />

            {category === "non-technical" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Upload ID Proof
                </label>
                <input
                  type="file"
                  onChange={(e) => setIdProof(e.target.files[0])}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="btn btn-success w-full hover:scale-105 transition-transform"
            >
              Verify & Continue
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 mt-4 text-center">
          (Demo OTP: <strong>{DEFAULT_OTP}</strong>)
        </p>
      </div>
    </div>
  );
}

export default OTPVerification;
