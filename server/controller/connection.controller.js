import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { connect } from "mongoose";

export const sendConnectionRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = req.user._id;
    if (currentUser.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send a connection request to yourself." });
    }

    const userConnection = req.user.connections.includes(currentUser);
    if (userConnection) {
      return res.status(400).json({
        message: "You have already sent a connection request to this user.",
      });
    }
    const existingRequest = await Connection.findOne({
      sender: currentUser,
      recipient: userId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        message:
          "You have already sent a pending connection request to this user.",
      });
    }
    const newConnection = new Connection({
      sender: currentUser,
      recipient: userId,
      status: "pending",
    });
    await newConnection.save();

    res.json({ message: "Connection request sent." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = req.user._id;
    const connection = await Connection.findOne({
      sender: userId,
      recipient: currentUser,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }
    connection.status = "accepted";
    await connection.save();

    // await User.findByIdAndUpdate(userId, {
    //   $push: { connections: currentUser },
    // });
    // await User.findByIdAndUpdate(currentUser, {
    //   $push: { connections: userId },
    // });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: currentUser },
    });
    await User.findByIdAndUpdate(currentUser, {
      $addToSet: { connections: userId },
    });


    const notification = new Notification({
      recipient: connection.sender,
      sender: currentUser,
      type: "connectionAccept",
      message: `${req.user.name} accepted your connection request.`,
    });
    await notification.save();

    res.json({ message: "Connection request accepted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const rejectConnectionRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = req.user._id;
    const connection = await Connection.findOne({
      sender: userId,
      recipient: currentUser,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }
    connection.status = "declined";
    await connection.save();

    await User.findByIdAndUpdate(currentUser, {
      $pull: { connections: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { connections: currentUser },
    });
    const user = await User.findById(userId);
    user.connections = user.connections.filter(
      (connection) => connection._id !== currentUser
    );
    await user.save();

    res.json({ message: "Connection request rejected." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;

    if (userId === currentUser)
      return res
        .status(400)
        .json({ message: "You cannot delete a connection with yourself." });

    const userConnection = req.user.connections.includes(currentUser);
    if (userConnection) {
      req.user.connections = req.user.connections.filter((id) => id !== userId);

      await User.findByIdAndUpdate(currentUser, {
        $pull: { connections: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { connections: currentUser },
      });
      res.json({ message: "Connection deleted successfully." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const connection = await Connection.find({
      recipient: currentUser,
      status: "pending",
    }).populate({
      path: "sender",
      select: "-password",
    })

    if (connection) {
      res.json(connection);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("connections").populate({
      path: "connections",
      select: "-password",
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getConnectionStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = req.user;
    if (currentUser.connections.includes(userId))
      return res.status(200).json({
        status: "connected",
      });

    const connection = await Connection.findOne({
      $or: [
        { recipient: userId, sender: currentUser._id },
        { recipient: currentUser._id, sender: userId },
      ],
      status: "pending",
    });
    if (connection) {
      if (connection.sender.toString() === currentUser._id.toString()) {
        return res.status(200).json({ status: "pending" });
      } else {
        return res.status(200).json({ status: "received" });
      }
    }
    return res.status(200).json({ status: "not connected" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
