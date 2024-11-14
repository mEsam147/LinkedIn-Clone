import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, House, LogOut, User, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import { motion } from "framer-motion";

const Navbar = () => {
  const queryCLient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axios.get("/notification");
      return response.data;
    },
    enabled: !!authUser,
  });
  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const response = await axios.get("/connection/requests");

      return response.data;
    },
    enabled: !!authUser,
  });

  const { data: getRequests } = useQuery({
    queryKey: ["getRequests"],
  });

  const notificationsCount =
    notifications?.filter((notification) => !notification?.isRead)?.length ?? 0;

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axios.post("/auth/logout");
    },
    onSuccess: () => {
      queryCLient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" bg-secondary drop-shadow-lg"
    >
      <div className="max-w-6xl mx-auto sm:py-3 py-1 flex items-center justify-between">
        <img
          src="/small-logo.png"
          className="sm:w-10 w-8 rounded-sm hover:rounded-md transition-all duration-150"
          alt=""
        />
        {!authUser && (
          <div className="flex items-center gap-x-3">
            <Link to={"/login"} className="btn btn-link text-primary ">
              Sign in
            </Link>
            <Link
              to={"/register"}
              className="btn btn-sm rounded-sm btn-primary text-secondary"
            >
              Join Now
            </Link>
          </div>
        )}

        {authUser && (
          <div className="flex items-center gap-x-8">
            <Link
              to={"/"}
              className="flex items-center justify-center flex-col cursor-pointer group "
            >
              <House className="size-5 group-hover:text-primary group-hover:scale-105 transition-all duration-150" />
              <span className="capitalize font-normal text-slate-700/70 text-sm hidden sm:block">
                Home
              </span>
            </Link>

            <Link
              to={`/network`}
              className="flex items-center justify-center flex-col cursor-pointer relative group"
            >
              <Users className="size-5 group-hover:scale-105 group-hover:text-primary transition-all duration-150 " />
              <div className="capitalize font-normal text-slate-700/50 text-sm hidden sm:block relative">
                my profile
              </div>
              {getRequests?.length > 0 && (
                <span className="absolute -top-2 right-1 bg-primary text-secondary w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {getRequests?.length}
                </span>
              )}
            </Link>
            <Link
              to={"/notification"}
              className="flex items-center justify-center flex-col cursor-pointer relative group"
            >
              <Bell className="size-5 group-hover:scale-105 group-hover:text-primary transition-all duration-150" />
              <span className="capitalize font-normal text-slate-700/70 text-sm hidden sm:block">
                Notifications
              </span>
              {notificationsCount > 0 && (
                <span className="absolute -top-2 right-3 bg-primary text-secondary w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {notificationsCount}
                </span>
              )}
            </Link>
            <Link
              to={`/profile/${authUser.username}`}
              className="flex items-center justify-center flex-col cursor-pointer group "
            >
              <User className="size-5 group-hover:scale-105 group-hover:text-primary transition-all duration-150" />
              <span className="capitalize font-normal text-slate-700/70 text-sm hidden sm:block">
                me
              </span>
            </Link>
            <div
              className="flex items-center justify-center gap-x-2 cursor-pointer group"
              onClick={logout}
            >
              <LogOut className="size-5 group-hover:translate-x-0.5 transition-all duration-150 group-hover:text-primary" />
              <span className="capitalize font-normal text-slate-700/70 text-sm hidden sm:block">
                Logout
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
