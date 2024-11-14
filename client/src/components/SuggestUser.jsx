import { Check, UserPlus, X } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import { StatusButtons } from "./Button.jsx";
const SuggestUser = ({ item }) => {


  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-y-2 justify-between items-center" key={item._id}>
        <Link
          to={`/profile/${item.username}`}
          className="flex items-center gap-x-2"
        >
          <img
            src={item.profileImage ? item.profileImage : "/avatar.png"}
            className="size-10 rounded-full object-cover "
            alt=""
          />
          <div className="flex flex-col">
            <span className="text-neutral  capitalize">{item.username}</span>
            <span className="text-slate-700/50 text-xs md:w-[90%] lowercase hidden md:block">
              {item.headLine}
            </span>
          </div>
        </Link>
        <StatusButtons item={item} />
      </div>
    </div>
  );
};

export default SuggestUser;
