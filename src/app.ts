import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import { commentRouter } from "./modules/comment/comment.router";
import { postRouter } from "./modules/posts/post.router";

const app: Application = express();

app.use(express.json());

// Configure CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Prisma Blog App");
});

export default app;
