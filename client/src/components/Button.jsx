import { Check, Clock, User, UserPlus, UserRoundCheck, X } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";

export const StatusButtons = ({ item }) => {
  const queryClient = useQueryClient();

  const { data: getStatus, isLoading } = useQuery({
    queryKey: ["status", item._id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/connection/status/${item._id}`);
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    staleTime: 10000,
    cacheTime: 60000,
  });
  const status = getStatus?.status;
  const updateStatus = (newStatus) => {
    queryClient.setQueryData(["status", item._id], (oldData) => ({
      ...oldData,
      status: newStatus,
    }));
  };

  const { mutate: request, isPending: isRequesting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/connection/request/${item._id}`);

        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onMutate: () => {
      updateStatus("pending");
    },
    onSuccess: () => {
      toast.success("Request sent", { position: "top-right" });
      queryClient.invalidateQueries({
        queryKey: ["status", item._id],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Error sending request");
      queryClient.invalidateQueries(["status", item._id]); // Optionally refetch on error
    },
  });

  const { mutate: accept, isLoading: isAccepting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.put(`/connection/accept/${item._id}`);
        console.log(res);
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    onMutate: () => {
      updateStatus("connected");
    },
    onSuccess: () => {
      toast.success("Connection accepted", { position: "top-right" });
      queryClient.invalidateQueries({
        queryKey: ["status", item._id],
      });
    },
  });

  const { mutate: reject } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.put(`/connection/reject/${item._id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onMutate: () => {
      updateStatus("not connected");
    },
  onSuccess: () => {
  toast.success("Request sent", { position: "top-right" });
  queryClient.invalidateQueries({
    queryKey: ["status", item._id],
  });
  updateStatus("pending");
},
  });

  const handleRequest = () => {
    if (status === "not connected") {
      request();
    }
  };

  switch (status) {
    case "pending":
      return (
        <button
          className="btn btn-warning btn-xs md:btn-sm rounded-full text-white outline-1 flex items-center btn-primary justify-center gap-x-1 disabled:bg-yellow-500 disabled:text-white"
          disabled
        >
          <Clock className="size-5 hidden lg:block" />
          Pending
        </button>
      );
    case "received":
      return (
        <div className="flex items-center gap-x-3">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.7 }}
            className="bg-success w-5 h-5 rounded-full flex items-center justify-center"
            onClick={accept}
          >
            <Check className="size-4 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.7 }}
            className="bg-error w-5 h-5 rounded-full flex items-center justify-center"
            onClick={reject}
          >
            <X className="size-4 text-white" />
          </motion.button>
        </div>
      );

    case "connected":
      return (
        <>
          <button
            className="btn btn-xs btn-success md:btn-sm rounded-full text-white "
            disabled
          >
            <UserRoundCheck className="size-5 hidden lg:block" />
            connected
          </button>
        </>
      );

    default:
      return (
        <button
          className="btn btn-xs md:btn-sm rounded-full btn-outline text-primary outline-1 flex items-center btn-primary justify-center gap-x-1"
          onClick={handleRequest}
        >
          <User Plus className="size-5 hidden lg:block" />
          Connect
        </button>
      );
  }
};
