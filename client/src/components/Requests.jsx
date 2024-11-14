import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "../utils/axios";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const Requests = ({ req }) => {
  const { data: getRequests } = useQuery({
    queryKey: ["getRequests"],
  });

  console.log(getRequests);
  
  const { mutate: accept, isPending: acceptPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.put(`/connection/accept/${req.sender._id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getRequests"],
      });
    },
  });

  const { mutate: reject, isPending: rejectPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.put(`/connection/reject/${req.sender._id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getRequests"],
      });
    },
    onError: (error) => {},
  });
  const handleAccept = () => {
    if (req.status === "pending") {
      accept();
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border border-gray-200 m-4 rounded-md shadow-sm ">
      <div className="flex items-center gap-x-3">
        <img
          src="/avatar.png"
          className="size-16 object-cover rounded-full"
          alt=""
        />
        <div className="flex flex-col">
          <span className="text-md font-bold capitalize ">
            {req?.sender?.name}
          </span>
          <span className="text-sm text-gray-500">{req?.sender?.headLine}</span>
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <button
          className="btn btn-sm btn-primary md:px-4 rounded-sm "
          onClick={handleAccept}
          disabled={acceptPending}
        >
          {acceptPending ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            "Accept"
          )}
        </button>
        <button
          className="btn btn-sm btn-success text-white md:px-4 rounded-sm"
          onClick={reject}
          disabled={rejectPending}
        >
          {rejectPending ? (
            <Loader className="size-5 animate-spin " />
          ) : (
            " Reject"
          )}
        </button>
      </div>
    </div>
  );
};

export default Requests;
