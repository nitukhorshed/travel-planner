const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");


// REGISTER
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      organizationName,
      email,
      password,
      role,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      organizationName:
        role === "planner" ? organizationName : null,
      email,
      password: hashedPassword,
      role,
      plannerStatus:
        role === "planner"
          ? "pending"
          : "approved",
    });

    res.status(201).json({
      message: "Registration successful",
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      token: generateToken(user._id),

      user: {
        id: user._id,
        fullName: user.fullName,
        organizationName: user.organizationName,
        email: user.email,
        role: user.role,
        plannerStatus: user.plannerStatus,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    role: req.user.role,
    plannerStatus: req.user.plannerStatus,
  });
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        plannerStatus: updatedUser.plannerStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};