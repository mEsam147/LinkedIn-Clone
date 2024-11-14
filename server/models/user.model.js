import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    headLine: {
      type: String,
      required: true,
      default: "linkedin is already linked",
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "EARTH",
    },
    aboutMe: {
      type: String,
      default: "I am a human being",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },

        company: {
          type: String,
          default: "Unknown",
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
        },
        degree: {
          type: String,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    }
  } catch (error) {
    console.error(error);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  try {
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error(error);
  }
};

export default mongoose.model("User", userSchema);
