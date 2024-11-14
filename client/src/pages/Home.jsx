import React from "react";
import Sidebar from "../components/Sidebar";
import Suggested from "../components/Suggested";
import CreatePost from "../components/CreatePost";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import Posts from "../components/Posts";
import PostsSkeleton from "../components/skeletons/PostsSkeleton";

const Home = () => {
  const { data: getFeedPosts, isLoading: feedLoading } = useQuery({
    queryKey: ["getFeedPosts"],
    queryFn: async () => {
      try {
        const res = await axios.get("/post/feed");
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });

  const { data: getSuggestion, isLoading: suggestionLoading } = useQuery({
    queryKey: ["getSuggestion"],
    queryFn: async () => {
      try {
        const res = await axios.get("/user/suggestion");
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });

  return (
    <div className="grid grid-cols-12 gap-4 my-3">
      <div className="col-span-3  hidden lg:block">
        <Sidebar />
      </div>
      <div className="col-span-8 lg:col-span-6">
        <CreatePost />

        {getFeedPosts?.length === 0 && (
          <div className="bg-secondary p-8 mt-2 rounded-md text-center font-semibold uppercase text-xl text-slate-700">
            No posts to display.
          </div>
        )}

        {feedLoading && (
          <>
            <PostsSkeleton />
            <PostsSkeleton />
            <PostsSkeleton />
          </>
        )}

        <div>
          {getFeedPosts?.map((post) => (
            <Posts key={post._id} post={post} feedLoading={feedLoading} />
          ))}
        </div>
      </div>
      <div className="col-span-4 lg:col-span-3">
        <Suggested
          getSuggestion={getSuggestion}
          suggestionLoading={suggestionLoading}
        />
      </div>
    </div>
  );
};

export default Home;
