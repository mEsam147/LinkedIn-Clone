import React from "react";
import Sidebar from "../components/Sidebar";

import { useQuery } from "@tanstack/react-query";
import NotificationDetails from "../components/NotificationDetails";

const Notification = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
  });

  return (
    <div className="grid grid-cols-12 gap-5 my-4">
      <div className=" col-span-3">
        <Sidebar />
      </div>
      <div className=" col-span-9 p-4 bg-secondary shadow rounded-lg ">
        {notifications?.length === 0 && (
          <div className="flex items-center justify-center my-10 text-xl font-bold text-gray-700">
            There's no notification Found
          </div>
        )}
        {notifications?.length > 0 &&
          notifications.map((notification) => (
            <>
              <h1 className="text-neutral text-xl font-bold">Notifications</h1>
              <NotificationDetails
                key={notification.id}
                notification={notification}
                isLoading={isLoading}
              />
            </>
          ))}
      </div>
    </div>
  );
};

export default Notification;
