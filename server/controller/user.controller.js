import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const getSuggestion = async (req, res) => {
  try {
    const currentUser = await User.find(req.user._id).select("connections");
    const suggestions = await User.find({
      _id: { $ne: req.user._id, $nin: currentUser.connections },
    })
      .select("-password")
      .limit(4);
    res.json(suggestions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profileFields = [
      "username",
      "name",
      "headLine",
      "aboutMe",
      "location",
      "education",
      "experience",
      "skills",
      "connections",
      "profileImage",
    ];
    const updatedUser = {};
    profileFields.forEach((field) => {
      if (req.body[field]) updatedUser[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updatedUser, {
      new: true,
    });
if (req.files) {
  const profileFile = req.files.profileImage?.[0];
  const coverFile = req.files.coverImage?.[0];

  if (profileFile) {
    const result = await cloudinary.uploader.upload(profileFile.path);
    user.profileImage = result.secure_url;
  }
  if (coverFile) {
    const result = await cloudinary.uploader.upload(coverFile.path);
    user.coverImage = result.secure_url;
  }
  await user.save();
}

    res.json({
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
