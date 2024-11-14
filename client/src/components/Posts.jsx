import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../utils/axios";
import PostAction from "./PostAction";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
const Posts = ({ post }) => {
const [comment, setComment] = useState("");
const [showComment, setShowComment] = useState(false);
const queryClient = useQueryClient();
const { data: authUser } = useQuery({ queryKey: ["authUser"] });
const { data: getSinglePost } = useQuery({ queryKey: ["singlePost"] });
const { data: getFeedPosts } = useQuery({ queryKey: ["getFeedPosts"] });

const isOwner = authUser?._id === post?.author?._id;
const isLiked = post?.likes?.includes(authUser?._id);

const { mutate: likePost, isLoading: isPending } = useMutation({
  mutationFn: async (id) => {
    try {
      const res = await axios.post(`/post/like/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["getFeedPosts"] });
    queryClient.invalidateQueries({ queryKey: ["singlePost"] });
  },
  onError: (error) => {
    toast.error(error.response.data.message);
  },
});

const handleLikePost = () => {
  if (post.likes.includes(authUser._id)) {
    post.likes = post.likes.filter((like) => like._id !== authUser._id);
  } else {
    post.likes = [...post.likes, authUser._id];
  }
  likePost(post._id);
};

  
  
const { mutate: deletePost, isPending: deletePending } = useMutation({
  mutationFn: async (id) => {
    try {
      const res = await axios.delete(`/post/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["getFeedPosts"] });
    queryClient.invalidateQueries({ queryKey: ["singlePost"] });
  },
  onError: (error) => {
    toast.error(error.response.data.message);
  },
});

const { mutate: createComment, isLoading: commentPending } = useMutation({
  mutationFn: async (id) => {
    try {
      const res = await axios.post(`post/comment/${id}`, {
        content: comment,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["getFeedPosts"] });
    queryClient.invalidateQueries({ queryKey: ["singlePost"] });
    setComment("");
  },
  onError: (error) => {
    toast.error(error.response.data.message);
  },
});

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-secondary shadow my-4 rounded-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <Link to={`profile/${post?.author?.username}`}>
            <img
              src={
                post?.author?.profileImage
                  ? post?.author?.profileImage
                  : "/avatar.png"
              }
              className="size-16 rounded-full object-cover"
              alt=""
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post?.author?.username}`}
              className=" text-slate-700 capitalize "
            >
              {post?.author?.username}
            </Link>
            <span className="text-sm text-gray-600/70 block lowercase">
              {post?.author?.headLine}
            </span>
            <span className="text-sm text-gray-600/40 ">
              {post?.createdAt ? formatDistanceToNow(post?.createdAt) : ""}
            </span>
          </div>
        </div>
        {isOwner && (
          <motion.span
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              deletePost(post._id);
            }}
          >
            {deletePending ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              <Trash2
                size={19}
                className="text-red-500 cursor-pointer hover:text-red-800 transition-all duration-150 "
              />
            )}
          </motion.span>
        )}
      </div>
      <Link to={`/post/${post?._id}`} className="mt-3">
        <p className="text-gray-800/70">{post?.content}</p>
        {post?.image && (
          <img
            src={post?.image}
            className="object-cover w-full h-64 rounded-md mt-2"
            alt=""
          />
        )}
      </Link>

      <div className="flex items-center justify-between mt-4 text-gray-500/70">
        <PostAction
          icon={
            <ThumbsUp
              className={`${isLiked ? "text-blue-700" : "text-gray-500"}`}
            />
          }
          title={`Like (${post?.likes?.length})`}
          click={handleLikePost}
        />
        <PostAction
          icon={<MessageCircle />}
          title={`Comment (${post?.comments?.length})`}
          click={() => setShowComment(!showComment)}
        />
        <PostAction icon={<Share2 />} title={`Share`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.03 }}
      >
        {showComment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="my-3 space-y-2"
          >
            {post?.comments?.map((comment) => {
              return (
                <div
                  className="bg-base-100 py-3 px-4 rounded-md"
                  key={comment._id}
                >
                  <div className="flex gap-x-2">
                    <Link to={`/profile/${comment?.user?.username}`}>
                      <img
                        src={
                          comment?.user?.profileImage
                            ? comment?.user?.profileImage
                            : "/avatar.png"
                        }
                        className="size-12 rounded-full object-cover"
                        alt=""
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/profile/${comment?.user?.username}`}
                        className="text-slate-500 text-sm font-bold"
                      >
                        {comment?.user?.username}
                      </Link>
                      <p className="text-slate-400 text-sm">
                        {comment?.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {showComment && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            // transition={{ duration: 0.4 }}
            className="w-full mt-4 flex items-center"
          >
            <input
              type="text"
              className="input w-full input-sm rounded-l-full"
              placeholder="type comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary rounded-r-full"
              disabled={commentPending}
              onClick={() => createComment(post._id)}
            >
              {commentPending ? (
                <Loader className="animate-spin size-5" />
              ) : (
                <Send />
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Posts;
