import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getSuggestion,
  getSingleUser,
  updateProfile,
} from "../controller/user.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();
router.get("/suggestion", protectedRoute, getSuggestion);
router.get("/:username", protectedRoute, getSingleUser);
router.put(
  "/update",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  protectedRoute,
  updateProfile
);

export default router;
