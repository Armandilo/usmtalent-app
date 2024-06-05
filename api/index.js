import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import skillRoute from "./routes/skill.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import chatRoute from "./routes/chat.route.js";
import chatmessageRoute from "./routes/chatmessage.route.js";
import cors from "cors";
import userreviewRoute from "./routes/userreview.route.js";
import barterRoute from "./routes/barter.route.js";
import { verifyToken } from "./middleware/jwt.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"]
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/skills", skillRoute);
app.use("/api/orders", verifyToken, orderRoute);
app.use("/api/conversations", verifyToken, conversationRoute);
app.use("/api/messages", verifyToken, messageRoute);
app.use("/api/chat", verifyToken, chatRoute);
app.use("/api/chatmessages", verifyToken, chatmessageRoute);
app.use("/api/reviews", verifyToken, reviewRoute);
app.use("/api/userreviews", verifyToken, userreviewRoute);
app.use("/api/barter", verifyToken, barterRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  console.error("Error:", errorMessage);
  return res.status(errorStatus).json({ message: errorMessage });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  connect();
  console.log(`Backend server is running on port ${PORT}!`);
});
