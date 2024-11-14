import Post from "../models/posts.model.js";
import Notification from "../models/notification.model.js";
import { sendCommentEmail } from "../mailtrap/handleEmails.js";
import cloudinary from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;
    let imageUrl;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResult.secure_url;
    }

    const post = new Post({
      image: imageUrl,
      content,
      author: userId,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id] },
    })
      .populate({
        path: "author",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      })
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized to delete this post",
      });

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  const { id: likeId } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(likeId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
      if (post.author.toString() !== userId.toString()) {
        const notification = new Notification({
          recipient: post.author,
          sender: userId,
          type: "like",
          postId: post._id,
        });
        await notification.save();
      }
    }
    await post.save();
    res.json(post);

    // todo
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const commentPost = async (req, res) => {
  const { id: postId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || content.trim() === "") {
    return res
      .status(400)
      .json({ message: "Comment content cannot be empty." });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({ user: userId, content });
    await post.save();

    if (post.author.toString() !== userId.toString()) {
      const notification = new Notification({
        recipient: post.author,
        sender: userId,
        type: "comment",
        postId: post._id,
      });
      await notification.save();
    }

    res.json({ message: "Comment added successfully.", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while commenting on the post.",
      error: error.message,
    });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
