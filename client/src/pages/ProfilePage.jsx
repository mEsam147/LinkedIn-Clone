import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfileExperience from "../components/profile/ProfileExperience";
import ProfileEducation from "../components/profile/ProfileEducation";
import ProfileSkills from "../components/profile/ProfileSkills";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { username } = useParams();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const {
    data: getUserProfile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getUserProfile", username],
    queryFn: async () => {
      try {
        const res = await axios.get(`/user/${username}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["getUserProfile", username] });
  queryClient.invalidateQueries({ queryKey: ["authUser"] });
  queryClient.refetchQueries({ queryKey: ["getUserProfile", username] });
  queryClient.refetchQueries({ queryKey: ["authUser"] });
},

    enabled: !!username,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username, refetch]);

  const isProfile = authUser?.username === getUserProfile?.username;

  if (isLoading) return <div>loading...</div>;
  return (
    <div className="max-w-3xl mx-auto  my-10 overflow-hidden">
      <ProfileHeader isProfile={isProfile} user={getUserProfile} />
      <ProfileAbout isProfile={isProfile} user={getUserProfile} />
      <ProfileExperience isProfile={isProfile} user={getUserProfile} />
      <ProfileEducation isProfile={isProfile} user={getUserProfile} />
      <ProfileSkills isProfile={isProfile} user={getUserProfile} />
    </div>
  );
};

export default ProfilePage;
