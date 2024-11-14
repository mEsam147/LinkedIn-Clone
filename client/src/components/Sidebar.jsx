import React from "react";
import { Link } from "react-router-dom";
import { Bell, House, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {motion} from 'framer-motion'

const Sidebar = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <motion.div
    
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-secondary shadow rounded-lg p-0.5 ">
      <div>
        <img
          src={authUser?.coverImage ? authUser?.coverImage : "/banner.png"}
          className="h-20 w-full rounded-t-lg object-cover"
          alt=""
        />
        <div className="flex justify-center flex-col items-center border-b border-gray-500/10">
          <img
            src={
              authUser?.profileImage ? authUser?.profileImage : "/avatar.png"
            }
            className="size-20 object-cover rounded-full mt-[-26px] drop-shadow-lg"
            alt=""
          />
          <h1 className="text-lg text-neutral font-bold">
            {authUser?.username}
          </h1>
          <p className="text-primary text-sm capitalize">{authUser?.headLine}</p>
          <span className="text-sm text-neutral/50">{authUser?.connections?.length} Connections</span>
        </div>
      </div>

      <div className="space-y-2  my-4 border-b border-gray-500/10">
        <Link
          to={"/"}
          className="flex items-center gap-x-3 hover:bg-red-500/30  group rounded-sm py-3 px-4"
        >
          <House className="size-5 group-hover:scale-110 group-hover:text-primary transition-all duration-200" />
          <p className="font-bold text-slate-700 text-sm">Home</p>
        </Link>
        <Link
          to={"/network"}
          className="flex items-center gap-x-3 hover:bg-red-500/30  group rounded-sm py-3 px-4"
        >
          <Users className="size-5 group-hover:scale-110 group-hover:text-primary transition-all duration-200" />
          <p className="font-bold text-slate-700 text-sm">My Network</p>
        </Link>
        <Link
          to={"/notification"}
          className="flex items-center gap-x-3 hover:bg-red-500/30  group rounded-sm py-3 px-4"
        >
          <Bell className="size-5 group-hover:scale-110 group-hover:text-primary transition-all duration-200" />
          <p className="font-bold text-slate-700 text-sm">Notifications</p>
        </Link>
      </div>
      <div className="my-4">
        <Link to={`/profile/${authUser?.username}`} className="text-primary px-3 hover:underline hover:text-slate-500 ">
          Visit Your Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default Sidebar;
