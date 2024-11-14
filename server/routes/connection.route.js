import express from "express";
import {
  acceptConnectionRequest,
  deleteConnection,
  getConnections,
  getConnectionStatus,
  getUserConnections,
  rejectConnectionRequest,
  sendConnectionRequest,
} from "../controller/connection.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/request/:userId", protectedRoute, sendConnectionRequest);
router.put("/accept/:userId", protectedRoute, acceptConnectionRequest);
router.put("/reject/:userId", protectedRoute, rejectConnectionRequest);
router.delete("/:userId", protectedRoute, deleteConnection);
router.get("/requests", protectedRoute, getConnections);
router.get("/", protectedRoute, getUserConnections);
router.get("/status/:userId", protectedRoute, getConnectionStatus);

export default router;
