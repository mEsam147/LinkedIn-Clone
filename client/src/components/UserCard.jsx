import React from "react";

const UserCard = ({ user }) => {

  return (
    <div className="bg-gray-50 shadow flex flex-col gap-y-3 justify-center items-center p-6 rounded-md">
      <img src="/avatar.png" className="size-16" alt="" />

      <div className="text-center space-y-2">
        <h1 className="text-md text-gray-900 font-bold capitalize">
          {user?.username}
        </h1>
        <p className="text-sm text-gray-600 ">{user?.headLine}</p>
        <p className="text-gray-400 text-sm">
          {user?.connections?.length} connections
        </p>
        <button className="btn btn-primary w-full btn-sm rounded-sm text-white ">
          Connected
        </button>
      </div>
    </div>
  );
};

export default UserCard;
