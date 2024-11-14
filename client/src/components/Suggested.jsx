import { Check, UserPlus, X } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SuggestSkeleton from "./skeletons/SuggestSkeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import SuggestUser from "./SuggestUser";

const Suggested = ({ getSuggestion, suggestionLoading }) => {


  const { data: getConnections } = useQuery({
    queryKey: ["getConnections"],
    queryFn: async () => {
      try {
        const res = await axios.get("/connection/requests");
        console.log(res);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });



  console.log(getConnections);

  return (
    <motion.div
    
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-secondary p-3 rounded-md shadow ">
      <h1 className="text-neutral font-bold text-md md:text-lg capitalize">
        People You May Know
      </h1>
      {suggestionLoading && (
        <>
          <SuggestSkeleton />
          <SuggestSkeleton />
          <SuggestSkeleton />
        </>
      )}

      {!suggestionLoading && (
        <div className="space-y-4 my-2">
          {getSuggestion?.map(
            (item) => (
              <SuggestUser item={item} key={item._id} />
            )
      
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Suggested;
