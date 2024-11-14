import { sendWelcomeEmail } from "../mailtrap/handleEmails.js";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/token-cookies.js";
import validator from "validator";

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    !name ||
    username.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    name.trim() === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email))
    return res.status(400).json({ message: "Invalid email" });

  if (password.length < 6 || !validator.isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }

  try {
    const usernameExist = await User.findOne({ username });
    if (usernameExist)
      return res.status(400).json({ message: "Username already exists" });
    const emailExist = await User.findOne({ email });

    if (emailExist)
      return res.status(400).json({ message: "Email already exists" });

    const user = new User({
      username,
      email,
      password,
      name,
    });
    generateTokenAndSetCookie(res, user._id);

    // todo : mailtrap send email to the user
    // const profilePath = `${process.env.FRONT_HOST}/profile/${user.username}`;
    // try {
    //   await sendWelcomeEmail(user.email, user.username, profilePath);
    // } catch (error) {
    //   console.log(error);
    // }

    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Wrong Email or Password" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({
        message: "Wrong Email or Password",
      });

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "connections",
      select: "-password",
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
