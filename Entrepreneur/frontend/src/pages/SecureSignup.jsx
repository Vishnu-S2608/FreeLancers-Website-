import React, { useState } from "react";

function SecureSignup() {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);

  const DEFAULT_OTP = "123456";

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (/^[0-9]{10}$/.test(mobile)) {
      alert(`📲 OTP sent to ${mobile} (Demo OTP: ${DEFAULT_OTP})`);
      setOtpSent(true);
    } else {
      alert("❌ Enter a valid 10-digit mobile number.");
    }
  };

  // Step 2: OTP change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtp(value);
      setIsOtpValid(value.length === 6); // Enable signup when OTP is 6 digits
    }
  };

  // Step 3: Verify OTP & Signup
  const handleSignup = (e) => {
    e.preventDefault();
    if (otp === DEFAULT_OTP) {
      alert("✅ Signup Successful!");
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Secure Signup
        </h2>

        {/* Step 1: Mobile Input */}
        {!otpSent && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength="10"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition-transform"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {otpSent && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              maxLength="6"
              className="w-full p-3 border rounded-lg text-center tracking-widest focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              disabled={!isOtpValid}
              className={`w-full py-3 rounded-lg transition-transform ${
                isOtpValid
                  ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Signup
            </button>
            <p className="text-sm text-gray-500 text-center">
              (Demo OTP: <strong>{DEFAULT_OTP}</strong>)
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default SecureSignup;
