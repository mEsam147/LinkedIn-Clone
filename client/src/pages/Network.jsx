import React from "react";
import Sidebar from "../components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import { Loader, UserPlus, UserPlus2 } from "lucide-react";
import Requests from "../components/Requests";
import UserCard from "../components/UserCard";

const Network = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: getRequests, isLoading } = useQuery({
    queryKey: ["getRequests"],
    queryFn: async () => {
      try {
        const res = await axios.get("/connection/requests");
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  return (
    <div className="grid grid-cols-12 my-4 gap-5">
      <div className="col-span-3">
        <Sidebar />
      </div>
      <div className="col-span-9 bg-secondary shadow rounded-lg">
        <h1 className="capitalize text-2xl font-bold text-neutral p-6">
          My Network
        </h1>

        <div className="border-b border-gray-200">
          {isLoading && (
            <div className="flex items-center justify-center my-5">
              <Loader className="size-7 animate-spin" />
            </div>
          )}

          {getRequests?.length === 0 && (
            <div className="flex flex-col items-center justify-center my-5">
              <UserPlus className="size-14 text-gray-500" />
              <h2 className="my-2 text-lg font-semibold text-slate-700">
                No Connection Requests
              </h2>
              <p className="text-xs text-center w-1/2 text-slate-400 leading-6">
                You don't have any pending connection requests at the moment,
                which means you can take a breather and enjoy your current
                connections.
              </p>
            </div>
          )}

          {getRequests?.length > 0 &&
            getRequests?.map((req) => {
              return <Requests req={req} key={req._id} />;
            })}
        </div>
        <div className="m-4">
          <h1 className="text-xl font-normal text-gray-800">My Connections</h1>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-3 px-6 ">
            {authUser?.connections?.length === 0 && (
              <div className=" flex justify-between flex-col items-center">
                <UserPlus2 className="size-14 text-gray-500" />
                <h2 className="my-2 text-lg font-semibold text-slate-700">
                  No Connections Yet
                </h2>
                <p className="text-xs text-center w-full text-slate-400 leading-6">
                  You currently don't have any connections. Follow other people
                  on LinkedIn to start building a stronger network.
                </p>
              </div>
            )}
            {authUser?.connections?.length > 0 &&
              authUser?.connections?.map((user) => {
                return <UserCard user={user} key={user._id} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
