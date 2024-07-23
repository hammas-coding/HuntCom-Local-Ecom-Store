const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const generateToken = require("../utils/generateToken");

require("dotenv").config(); 

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for registration is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", email); 

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP");
  }
};


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isSeller } = req.body;

  if (!name || !email || !password || isSeller === undefined) {
    res.status(400);
    throw new Error("Name, email, password, and isSeller are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const otp = crypto.randomBytes(3).toString("hex").toUpperCase();
  const expiresAt = new Date(Date.now() + 10 * 60000); 

  await Otp.create({
    email,
    otp,
    expiresAt,
    userDetails: { name, email, password, isSeller },
  });

  const otpSent = await sendOTP(email, otp);

  if (!otpSent) {
    res.status(500);
    throw new Error("Failed to send OTP");
  }

  res.status(200).json({ message: "OTP sent to email for registration" });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    if (new Date() > otpRecord.expiresAt) {
      res.status(400);
      throw new Error("OTP expired");
    }

    const { name, password, isSeller } = otpRecord.userDetails;

    const newUser = await User.create({
      name,
      email,
      password,
      isSeller,
    });

    if (!newUser) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    await otpRecord.deleteOne(); 

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
      isSeller: newUser.isSeller,
    });
  } catch (error) {
    console.error("Error verifying OTP and registering user:", error);
    res.status(500).json({ error: "Failed to verify OTP and register user" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, isSeller } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (isSeller !== undefined && user.isSeller !== isSeller) {
      res.status(401);
      throw new Error("Unauthorized: Incorrect seller status");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isSeller: user.isSeller, 
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { registerUser, verifyOtp, loginUser, getUserProfile };
