import { useMutation } from "@tanstack/react-query";
import { isExists } from "date-fns";
import { School, X } from "lucide-react";
import React, { useState } from "react";
import axios from "../../utils/axios";
import {motion} from 'framer-motion'

const ProfileEducation = ({ user, isProfile }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [educations, setEducations] = useState(user?.education || []);
  const [educationData, setEducationData] = useState({
    school: "",
    degree: "",
    startDate: "",
    endDate: "",
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async () => {
      const data = { ...user, education: educations };
      try {
        const res = await axios.put("/user/update", data);

        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Education updated successfully");
    },
    onError: (error) => {
      console.error("Error updating education:", error);
    },
  });

  const addEducation = () => {
    setEducations([...educations, educationData]);
    setEducationData({
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
    });
    setIsEdit(false);
    updateProfile();
  };
  const deleteEducation = (id) => {
    setEducations(educations.filter((education) => education._id !== id));
    setIsEdit(false);
    updateProfile();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="my-6 bg-secondary rounded-lg shadow  p-5"
    >
      <h1 className="text-xl font-bold text-slate-800">Education</h1>

      <div className="my-4">
        {educations.length > 0 &&
          educations.map((item) => (
            <div
              className="flex justify-between px-6 bg-red-500/5  py-2 rounded-lg my-4"
              key={item._id}
            >
              <div className="flex gap-x-3">
                <School className="size-6 text-gray-800" />
                <div className="flex flex-col gap-y-3">
                  <p className="text-slate-800 text-lg font-bold">
                    {item?.school}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.startDate).toLocaleDateString()}
                  </p>{" "}
                  <p className="text-gray-500 text-sm capitalize">
                    {item?.degree}
                  </p>
                </div>
              </div>

              {isProfile && (
                
              <button
                className="btn btn-ghost btn-xs rounded-sm"
                onClick={() => deleteEducation(item._id)}
              >
                <X className="size-5 text-gray-600" />
              </button>
              )}
            </div>
          ))}
      </div>

      {isEdit && (
        <motion.div
          className="space-y-4 px-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <input
            type="text"
            className="input input-bordered input-sm w-full"
            placeholder="School"
            value={educationData.school}
            onChange={(e) =>
              setEducationData({ ...educationData, school: e.target.value })
            }
          />
          <input
            type="text"
            className="input input-bordered input-sm w-full"
            placeholder="Degree"
            value={educationData.degree}
            onChange={(e) =>
              setEducationData({ ...educationData, degree: e.target.value })
            }
          />
          <input
            type="date"
            className="input input-bordered input-sm w-full"
            value={educationData.startDate}
            onChange={(e) =>
              setEducationData({ ...educationData, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className="input input-bordered input-sm w-full"
            value={educationData.endDate}
            onChange={(e) =>
              setEducationData({ ...educationData, endDate: e.target.value })
            }
          />
          <button
            className="btn btn-primary btn-sm rounded-sm text-white"
            onClick={addEducation}
          >
            Add Education
          </button>
        </motion.div>
      )}

      {!isEdit && isProfile && (
        <button
          className="btn btn-sm btn-link text-sm my-2"
          onClick={() => setIsEdit(true)}
        >
          Edit Education
        </button>
      )}
    </motion.div>
  );
};

export default ProfileEducation;
