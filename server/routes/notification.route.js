import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  deleteNotification,
  markNotificationSeen,
} from "../controller/notification.controller.js";

const router = express.Router();
router.get("/", protectedRoute, getNotifications)

router.post("/seen/:id", protectedRoute, markNotificationSeen);

router.delete("/:id" , protectedRoute, deleteNotification)

export default router;
