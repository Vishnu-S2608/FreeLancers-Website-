import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Send OTP
router.post("/send", async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ✅ Verify OTP
router.post("/verify", async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verification_check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code });

    if (verification_check.status === "approved") {
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
