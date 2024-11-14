import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient()

  const { mutate: register, isPending } = useMutation({
    mutationFn: async ({ formData }) => {
      try {
        const res = await axios.post("/auth/register", { ...formData });

        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      })

      toast.success(data.message || "Something went wrong");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    register({ formData });
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center max-w-xl mx-auto  ">
      <div className="flex items-center gap-x-1 ">
        <p className="text-4xl font-semibold text-primary">Linked</p>
        <img
          src="/small-logo.png"
          className="w-8 rounded-sm object-cover "
          alt=""
        />
        .
      </div>
      <h1 className="text-neutral font-bold text-lg md:text-2xl mt-5 text-center">
        Make The Most Of Your professional like
      </h1>

      <div className="bg-secondary rounded-lg w-full mt-4 md:mt-8 sm:p-10 p-5 drop-shadow-lg">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="mb-3 input-bordered input w-full "
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            name="username"
            className="mb-3 input-bordered input w-full "
            placeholder="userName"
            onChange={handleChange}
            value={formData.username}
          />
          <input
            type="text"
            name="email"
            className="mb-3 input-bordered input w-full "
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            name="password"
            className="mb-3 input-bordered input w-full "
            placeholder="Password(6+Characters)"
            onChange={handleChange}
            value={formData.password}
          />

          <button
            type="submit"
            className="btn btn-primary w-full  font-bold text-secondary md:text-lg"
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="size-6 animate-spin" />
            ) : (
              " Agree & join"
            )}
          </button>
        </form>
        <div className="flex items-center sm:gap-x-4 gap-x-1 my-6 sm:px-8 px-6 w-full">
          <span className="h-0.5 bg-primary/10 w-1/2 " />
          <p className="text-primary/70 relative font-semibold  text-center flex-1 whitespace-nowrap  ">
            Already on LinkedIn
          </p>
          <span className="h-0.5 bg-primary/10 w-1/2 " />
        </div>

        <Link
          to={"/login"}
          className="text-center text-primary flex justify-center  font-bold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
