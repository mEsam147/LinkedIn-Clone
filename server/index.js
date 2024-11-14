import express, { urlencoded } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import ConnectionDb from "./config/db.js";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notification.route.js";
import connectionRoute from "./routes/connection.route.js";

const app = express();

dotenv.config();
app.use(express.json({ limit: "5mb", extended: true }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  // origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));


const __dirname = path.resolve();

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/connection", connectionRoute);

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "/client/dist");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientPath, "index.html"));
  });
}

app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  ConnectionDb();
});


