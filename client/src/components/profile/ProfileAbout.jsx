import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../../utils/axios";
import {motion} from 'framer-motion'

const ProfileAbout = ({ user, isProfile }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [about, setAbout] = useState(user?.aboutMe || []);

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axiosInstance.put("/user/update", data);
        console.log(res);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  return (
    <motion.div
    
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="my-6 bg-secondary shadow rounded-lg p-5">
      <h1 className="text-slate-900 text-xl font-semibold capitalize">About</h1>
      {isEdit ? (
        <motion.textarea
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="textarea block w-full my-2"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      ) : (
        <p className="text-gray-500 my-2">{about}</p>
      )}

      {isEdit && (
        <>
          <button
            className="btn btn-primary btn-xs text-white"
            onClick={() => {
              setIsEdit(false);
              updateProfile({ aboutMe: about }); 
            }}
          >
            save
          </button>
        </>
      )}
      {isProfile && (
        <button
          className="btn btn-link btn-sm text- text-primary"
          onClick={() => setIsEdit(true)}
        >
          Edit
        </button>
      )}
    </motion.div>
  );
};

export default ProfileAbout;
