import { useMutation } from "@tanstack/react-query";
import { SendHorizontal, X } from "lucide-react";
import React, { useState } from "react";
import axiosInstance from "../../utils/axios";
import { motion } from "framer-motion";
const ProfileSkills = ({ user, isProfile }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [skills, setSkills] = useState(user?.skills || []);
  const [inputSkills, setInputSkill] = useState("");

  const { mutate: updateProfile } = useMutation({
    mutationFn: async () => {
      const data = { ...user, skills: skills };
      try {
        const res = await axiosInstance.put("/user/update", data);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });
  const handleAddSkill = () => {
    if (inputSkills.trim() === "" || skills.includes(inputSkills)) return;
    setSkills([...skills, inputSkills]);
    setInputSkill("");
    setIsEdit(false);
    updateProfile();
  };

  const handleDeleteSkill = (skill) => {
    setSkills((prevSkills) => prevSkills.filter((sk) => sk !== skill));
    updateProfile();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-secondary shadow rounded-lg p-5"
    >
      <h1 className="text-xl font-bold text-slate-800 capitalize">Skills</h1>

      <div className="flex items-center gap-x-3">
        {skills?.length > 0 &&
          skills?.map((sk) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="my-2 badge badge-outline badge-primary flex items-center bg-gray-500/5 gap-x-1 badge-lg  "
              key={sk}
            >
              <p className="text-md capitalize text-gray-500 ">{sk}</p>
              {isProfile && (
                
              <X
                className="size-4 cursor-pointer text-rose-600"
                onClick={() => handleDeleteSkill(sk)}
              />
              )}
            </motion.div>
          ))}
      </div>
      {isEdit && (
        <motion.div
        
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="my-3 px-4 flex items-center">
          <input
            type="text"
            className="input input-sm w-full rounded-r-none"
            placeholder="type Skill"
            value={inputSkills}
            onChange={(e) => setInputSkill(e.target.value)}
          />
          <button
            className="btn btn-sm btn-primary group rounded-l-none"
            onClick={handleAddSkill}
          >
            <SendHorizontal className="size-5 group-hover:translate-x-1 transition-all duration-150 group-hover:text-white" />
          </button>
        </motion.div>
      )}
      {!isEdit && isProfile && (
        <button
          className="btn btn-sm btn-link text-primary rounded-sm my-2"
          onClick={() => setIsEdit(true)}
        >
          Edit Skills
        </button>
      )}
    </motion.div>
  );
};

export default ProfileSkills;
