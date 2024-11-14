import React from "react";
import {
  ExternalLink,
  Eye,
  Loader,
  MessageSquareDot,
  ThumbsUp,
  Trash,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const NotificationDetails = ({ notification, isLoading }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteNotification, isPending: pendingDelete } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.delete(`/notification/${id}`);
        console.log(res);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      toast.success("Notification deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: isRead, isPending: readingPending } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.post(`/notification/seen/${id}`);
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Notification marked as read successfully!");
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "something went wrong");
    },
  });
  const handleTypeOfNotification = (type) => {
    switch (type) {
      case "comment":
        return (
          <Link
            to={`/profile/${notification?.sender?.username}`}
            className="flex items-center text-gray-400 gap-x-2"
          >
            <MessageSquareDot
              className={`${notification.isRead ? "text-primary" : ""}`}
            />
            <h2 className="text-gray-500 lowercase">
              <strong className="mx-1  text-neutral capitalize">
                {notification?.sender?.username}
              </strong>
              Commented in Your Post
            </h2>
          </Link>
        );

      case "like":
        return (
          <Link
            to={`/profile/${notification?.sender?.username}`}
            className="flex items-center text-gray-400 gap-x-2"
          >
            <ThumbsUp
              className={`${notification.isRead ? "text-primary" : ""}`}
            />
            <h2 className="text-gray-500 lowercase">
              <strong className="mx-1  text-neutral capitalize ">
                {notification?.sender?.username}
              </strong>
              liked in Your Post
            </h2>
          </Link>
        );

      case "connectionAccept":
        return (
          <Link
            to={`/profile/${notification?.sender?.username}`}
            className="flex items-center text-gray-400 gap-x-2"
          >
            <UserPlus
              className={`${notification.isRead ? "text-primary" : ""}`}
            />
            <h2 className="text-gray-500 lowercase">
              <strong className="mx-1  text-neutral capitalize ">
                {notification?.sender?.username}
              </strong>
              accepted your connection
            </h2>
          </Link>
        );
    }
  };

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div className="flex justify-between items-start  w-full p-3 border border-gray-200 mt-5 rounded-lg hover:shadow-sm  transition-all duration-150 ">
      <div className="flex items-center gap-x-6 w-[80%] ">
        <Link to={`/profile/${notification?.sender?.username}`}>
          <img
            src={
              notification?.sender.profileImage
                ? notification?.sender?.profileImage
                : "/avatar.png"
            }
            alt=""
            className="size-12 object-cover rounded-full"
          />
        </Link>
        <div className="w-full">
          {handleTypeOfNotification(notification?.type)}
          <p className="text-sm lowercase text-gray-500 my-2">
            {formatDistanceToNow(notification?.createdAt)}
          </p>
          {notification?.postId && (
            <div className="flex items-center justify-between  bg-gray-50 hover:shadow hover:bg-gray-100 transition-all duration-150 py-2 my-2 px-2 w-[65%] group">
              <Link
                to={`/post/${notification?.postId}`}
                className="flex items-center gap-x-2 flex-1 w-1/2 text-gray-500 rounded-md px-2"
              >
                {notification.postId.image && (
                  <img
                    src={notification?.postId?.image}
                    alt=""
                    className="size-16 rounded-md object-cover"
                  />
                )}
                <p className="text-gray-500 text-xs">
                  {notification?.postId?.content}
                </p>
              </Link>
              <div>
                <ExternalLink className="size-5 text-gray-400 group-hover:scale-110 group-hover:text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        {!notification.isRead && (
          <button
            className="btn btn-sm  rounded-md text-primary"
            onClick={() => isRead(notification?._id)}
          >
            {readingPending ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              <Eye className="size-4 " />
            )}
          </button>
        )}
        <button
          className="btn btn-sm btn-error   rounded-md text-white"
          onClick={() => deleteNotification(notification._id)}
          disabled={pendingDelete}
        >
          {pendingDelete ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <Trash className="size-4 " />
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationDetails;
