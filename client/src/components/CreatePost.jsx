import { Images, Loader, X } from "lucide-react";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("content", content);

        const res = await axios.post("/post/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Change to multipart/form-data for file uploads
          },
        });

        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Post created successfully");
      setContent("");
      setImage(null);
      setPreviewImage(null);
      queryClient.invalidateQueries({
        queryKey: ["getFeedPosts"],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Error creating post");
    },
  });

  const handleCreate = () => {
    if (content.trim() === "") return;
    createPost();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Set preview image URL
    }
  };
  return (
    <div className="bg-secondary shadow p-3 rounded-lg">
      <div className="flex gap-x-3">
        <img
          src={authUser?.profileImage ? authUser?.profileImage : "/avatar.png"}
          className="size-14 rounded-full shadow object-cover bg-center"
          alt=""
        />
        <textarea
          className="textarea textarea-bordered w-full border-none rounded-md"
          placeholder="What is in Your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {previewImage && (
        <div className="my-5 relative">
          <img
            src={previewImage}
            className="w-full h-[300px] rounded-lg object-cover relative "
            alt=""
          />
          <span
            className="absolute top-2 right-4 bg-primary w-6 h-6 flex items-center justify-center rounded-full text-secondary text-sm  hover:bg-neutral cursor-pointer transition-all duration-200 hover:scale-110 "
            onClick={() => {
              setPreviewImage(null);
              setImage(null);
            }}
          >
            <X className="size-4" />
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <label className="flex items-center gap-x-2 cursor-pointer group">
          <Images className="text-gray-800/60 group-hover:text-primary" />
          <span className="text-gray-500/60">Photo</span>
          <input
            type="file"
            hidden
            onChange={handleImageChange} // Update this line to use the new handler
          />
        </label>
        <button
          className="btn btn-primary rounded-full btn-sm px-6 text-white font-bold"
          onClick={handleCreate}
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin size-5" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
