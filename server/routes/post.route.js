import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  getFeedPosts,
  deletePost,
  likePost,
  commentPost,
  getSinglePost,
} from "../controller/post.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();
router.get("/feed", protectedRoute, getFeedPosts);
router.get("/:id", protectedRoute, getSinglePost);
router.post("/create", upload.single("image"), protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likePost);
router.post("/comment/:id", protectedRoute, commentPost);
router.delete("/:id", protectedRoute, deletePost);

export default router;
