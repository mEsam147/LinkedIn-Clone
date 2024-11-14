import React, { useEffect, useState } from "react";
import { Camera, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../utils/axios";

const ProfileHeader = ({ user, isProfile }) => {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(user || {});

  const [isEdit, setIsEdit] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(userData?.coverImage);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const { data: getUserProfile } = useQuery({
    queryKey: ["getUserProfile", userData?.username],
    enabled: !!userData.username,
  });

  const {
    mutate: updateProfile,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("profileImage", profileImage);
      formData.append("coverImage", coverImage);

      try {
        const res = await axios.put(
          "/user/update",
          {
            ...userData,
            profileImage: profileImage,
            coverImage: coverImage,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getUserProfile", userData?.username],
      });
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview &&
        setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview && setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-secondary rounded-lg shadow"
    >
      <div className="relative">
        {coverImagePreview ? (
          <img
            src={coverImagePreview}
            className="w-full h-44 rounded-t-lg object-cover relative"
            alt=""
          />
        ) : (
          <img
            src={userData.coverImage || coverImagePreview || "/banner.png"}
            className="w-full h-44 rounded-t-lg object-cover relative"
            alt=""
          />
        )}
        {isEdit && (
          <motion.label
            className="absolute top-4 right-4 text-white  flex items-center justify-center size-7 rounded-full bg-white hover:bg-white/50  cursor-pointer"
            whileTap={{ scale: 0.6 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <Camera className="size-5 text-black" />
            <input type="file" hidden onChange={handleCoverImageChange} />
          </motion.label>
        )}
      </div>
      <div className="flex items flex-col gap-4  justify-center items-center py-4 px-4  ">
        <div className="relative">
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              className="size-36 rounded-full object-cover -mt-16 shadow-sm relative"
              alt=""
            />
          ) : (
            <img
              src={
                userData.profileImage
                  ? userData.profileImage
                  : profileImagePreview
                  ? profileImagePreview
                  : "/avatar.png"
              }
              className="size-36 rounded-full object-cover -mt-16 shadow-sm relative"
              alt=""
            />
          )}
          {isEdit && (
            <motion.label
              className="absolute bottom-4 right-1 text-white  flex items-center justify-center size-7 rounded-full bg-white shadow  cursor-pointer"
              whileTap={{ scale: 0.6 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
            >
              <Camera className="size-5 text-black" />
              <input type="file" hidden onChange={handleImageChange} />
            </motion.label>
          )}
        </div>
        {isEdit ? (
          <input
            type="text"
            className="input  input-sm w-full text-center "
            value={userData?.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
        ) : (
          <h2 className="text-slate-800 text-lg capitalize ">
            {userData?.username}
          </h2>
        )}
        {isEdit ? (
          <input
            type="text"
            className="input  input-sm w-full text-center "
            value={userData?.headLine}
            onChange={(e) =>
              setUserData({ ...userData, headLine: e.target.value })
            }
          />
        ) : (
          <p className="text-gray-500 text-sm capitalize ">
            {userData?.headLine}
          </p>
        )}

        <div className="flex items-center justify-center gap-x-1 text-sm text-gray-500">
          <MapPin className="size-5" />
          {isEdit ? (
            <input
              className="w-fll input  input-sm w-full text-center"
              value={userData.location}
              onChange={(e) =>
                setUserData({ ...userData, location: e.target.value })
              }
            />
          ) : (
            <p className="uppercase">{user?.location}</p>
          )}
        </div>

        {isProfile && (
          <div className="flex flex-col gap-2 w-full">
            {isEdit ? (
              <button
                className="btn btn-sm btn-primary text-white rounded-full w-full font-semibold"
                onClick={() => {
                  setIsEdit(false);

                  updateProfile();
                }}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            ) : (
              <button
                className="btn btn-sm w-full  rounded-full text-white btn-primary"
                onClick={() => setIsEdit(true)}
              >
                Edit Profile
              </button>
            )}
            {(isError || isSuccess) && (
              <p
                className={`text-sm ${
                  isError ? "text-red-500" : "text-green-500"
                }`}
              >
                {isError
                  ? "Error updating profile"
                  : "Profile updated successfully"}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
