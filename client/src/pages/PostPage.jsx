import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import { Loader } from "lucide-react";
const PostPage = () => {
  const { postId } = useParams();
  const queryClient = useQueryClient();

  const { data: getSinglePost, isLoading } = useQuery({
    queryKey: ["singlePost", postId],
    queryFn: async () => {
      try {
        const res = await axios.get(`/post/${postId}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });

  if (!getSinglePost) {
    return (
      <div className="flex items-center justify-center my-8 text-xl font-bold text-slate-700 uppercase">
        Post Not found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      <div className=" col-span-3">
        <Sidebar />
      </div>
      <div className=" col-span-9 bg-secondary shadow p-5 rounded-lg px-9">
        {isLoading && (
          <div className="flex items-center justify-center my-16 ">
            <Loader className="size-6 animate-spin" />
          </div>
        )}
        {!isLoading && <Posts post={getSinglePost} />}
      </div>
    </div>
  );
};

export default PostPage;
