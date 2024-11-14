import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "./utils/axios";
import Layout from "./components/layout/Layout";
import Notification from "./pages/Notification";
import Network from "./pages/Network";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) return null;

        throw error;
      }
    },
  });
  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notification"
          element={authUser ? <Notification /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/network"
          element={authUser ? <Network /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
