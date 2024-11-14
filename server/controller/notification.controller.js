import notificationModel from "../models/notification.model.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      recipient: userId,
    })
      .populate({
        path: "sender",
        select: "-password",
      })
      .populate({
        path: "recipient",
        select: "-password",
      })
      .populate({
        path: "postId",
      })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  const userId = req.user._id;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    console.log(notification.recipient);
    console.log(userId);

    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Your Not Allow - unAuthorized" });
    }
    await Notification.findByIdAndDelete({
      _id: notificationId,
      recipient: notification.recipient,
    });
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markNotificationSeen = async (req, res) => {
  const { id: notificationId } = req.params;
  const userId = req.user._id;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "unauthorized" });
    }
    notification.isRead = true;

    await notification.save();
    res.json({ message: "Notification marked as seen" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
