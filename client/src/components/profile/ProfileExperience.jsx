import { Briefcase, X } from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../../utils/axios";
import {motion} from 'framer-motion'
const ProfileExperience = ({ isProfile, user }) => {
  const [experiences, setExperiences] = useState(user?.experience || []);

  const [experienceData, setExperienceData] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });
  const [isEdit, setIsEdit] = useState(false);

  const { mutate: updateProfile } = useMutation({
    mutationFn: async () => {
      try {
        const data = { ...user, experience: experiences };
        const res = await axios.put("/user/update", data);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });

  const handleDelete = (id) => {
    setExperiences((prevExperiences) =>
      prevExperiences.filter((ex) => ex._id !== id)
    );
    updateProfile();
  };

  const handleAdd = () => {
    if (
      experienceData.title &&
      experienceData.company &&
      experienceData.startDate
    ) {
      setExperiences((prevExperiences) => [...prevExperiences, experienceData]);
      setExperienceData({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
      setIsEdit(false);
      updateProfile();
    }
  };

  return (
    <motion.div
    
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-secondary p-5 rounded-lg shadow">
      <h1 className="text-slate-800 font-bold text-lg capitalize">
        Experience
      </h1>
      {experiences.length > 0 &&
        experiences?.map((item, i) => (
          <motion.div
          
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 mt-4 bg-red-500/5 rounded-lg p-2" key={i}>
            <div className="flex justify-between px-6">
              <div className="flex gap-x-2">
                <span className="text-slate-700 ">
                  <Briefcase />
                </span>
                <div className="flex flex-col gap-y-2 text-gray-500 capitalize text-sm">
                  <p className="font-bold text-slate-700 text-lg">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-x-2 capitalize">
                    {item?.startDate && item?.endDate ? (
                      <p>
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()} -{" "}
                      </p>
                    ) : item?.startDate ? (
                      <p>
                        {new Date(item.startDate).toLocaleDateString()} -
                        Present
                      </p>
                    ) : (
                      <p>Present</p>
                    )}
                  </div>
                  <p>{item.company}</p>
                </div>
              </div>
              {isProfile && (
                
              <button
                className="btn btn-ghost btn-xs rounded-sm text-gray-700"
                onClick={() => handleDelete(item._id)}
              >
                <X size={20} />
              </button>
              )}
            </div>
          </motion.div>
        ))}
      {isProfile && (
        <button
          className="btn btn-link btn-sm rounded-sm my-2 "
          onClick={() => setIsEdit(true)}
        >
          Edit Experiences
        </button>
      )}

      {isEdit && (
        <motion.div
        
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full my-8 space-y-6 relative">
          <input
            type="text"
            placeholder="title"
            className="input input-bordered input-sm w-full"
            onChange={(e) =>
              setExperienceData({ ...experienceData, title: e.target.value })
            }
            value={experienceData.title}
          />
          <input
            type="text"
            placeholder="company"
            className="input input-bordered input-sm w-full"
            onChange={(e) =>
              setExperienceData({ ...experienceData, company: e.target.value })
            }
            value={experienceData.company}
          />
          <input
            type="date"
            className="input input-bordered input-sm w-full"
            onChange={(e) =>
              setExperienceData({
                ...experienceData,
                startDate: e.target.value,
              })
            }
            value={experienceData.startDate}
          />
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              id="checkbox"
              className=" checkbox checkbox-primary checkbox-sm"
              checked={experienceData.currentlyWorking}
              onChange={(e) =>
                setExperienceData({
                  ...experienceData,
                  currentlyWorking: e.target.checked,
                })
              }
            />
            <label
              htmlFor="checkbox"
              className="cursor-pointer text-gray-500 text-sm"
            >
              i Currently Work here
            </label>
          </div>
          {experienceData?.currentlyWorking && (
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              onChange={(e) =>
                setExperienceData({
                  ...experienceData,
                  endDate: e.target.value,
                })
              }
              value={experienceData.endDate}
            />
          )}

          <textarea
            name=""
            id=""
            className="textarea  w-full"
            placeholder="Description"
            onChange={(e) =>
              setExperienceData({
                ...experienceData,
                description: e.target.value,
              })
            }
            value={experienceData.description}
          ></textarea>
          <div className="flex flex-col gap-2  items-start justify-start">
            <button
              className="btn btn-primary text-white rounded-sm "
              onClick={handleAdd}
            >
              Add Experience
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileExperience;
