import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = async (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
      secure: true,
      sameSite: "strict",
    });
  } catch (error) {
    console.log(error);
  }
};
