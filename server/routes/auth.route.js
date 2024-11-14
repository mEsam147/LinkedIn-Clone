import express from "express";
import { getCurrentUser, login, logout, register } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get('/me' ,protectedRoute, getCurrentUser)

export default router;
