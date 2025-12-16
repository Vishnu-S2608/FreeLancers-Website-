// src/pages/FreelancerSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FreelancerSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [idProof, setIdProof] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setStep(2);
  };

  // ✅ Send OTP using Twilio backend
  const handleSendOtp = async () => {
  if (!mobile) {
    alert("Please enter your mobile number first.");
    return;
  }

  // Ensure +91 prefix
  const formattedNumber = mobile.startsWith("+") ? mobile : `+91${mobile}`;

  try {
    setLoading(true);
    const response = await fetch("http://localhost:5000/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formattedNumber }),
    });
    const data = await response.json();

    if (data.success) {
      setOtpSent(true);
      alert("OTP sent successfully!");
    } else {
      alert("Failed to send OTP: " + data.error);
    }
  } catch (error) {
    console.error(error);
    alert("Error sending OTP");
  } finally {
    setLoading(false);
  }
};


  // ✅ Verify OTP using Twilio backend
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, code: otp }),
      });
      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
        if (category === "Technical") {
          navigate("/profile-setup");
        } else if (category === "Non-Technical" && idProof) {
          navigate("/profile-setup");
        } else {
          alert("Please upload ID proof for Non-Technical category.");
        }
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Big Background Word */}
      <h1
        className="absolute 
             text-[4rem] sm:text-[6rem] md:text-[9rem] lg:text-[13rem] 
             font-extrabold text-gray-200 tracking-widest select-none 
             text-center w-full z-0
             top-64 sm:top-12 md:top-16 lg:top-20"
      >
        ORBIT
      </h1>

      {/* Content */}
      <div
        className="
          relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-2xl
          -mt-24 sm:mt-0
        "
      >
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-snug">
              Start Your <span className="text-indigo-600">Rise</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto px-2">
              Choose your path to shine. Are you ready to take off in a{" "}
              <span className="text-indigo-600 font-semibold">Technical</span>{" "}
              role or a{" "}
              <span className="text-indigo-600 font-semibold">Non-Technical</span>{" "}
              role?
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => handleCategorySelect("Technical")}
                className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition"
              >
                Technical
              </button>
              <button
                onClick={() => handleCategorySelect("Non-Technical")}
                className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Non-Technical
              </button>
              <button
                onClick={() => navigate("/freelancer-dashboard")}
                className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Profile
              </button>
            </div>
          </>
        )}

        {/* Step 2: Verification */}
        {step === 2 && (
          <div className="space-y-5 text-left max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-indigo-700 text-center">
              🔐 Verification
            </h2>

            {!otpSent && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="8610338487"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="btn btn-outline btn-success mt-2 w-full"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {otpSent && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Enter OTP"
                    required
                  />
                </div>

                {category === "Non-Technical" && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Upload ID Proof
                    </label>
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full"
                      onChange={(e) => setIdProof(e.target.files[0])}
                      required
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="btn btn-primary w-full mt-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "🚀 Signup"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default FreelancerSignup;
