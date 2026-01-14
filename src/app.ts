import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import { postRouter } from "./modules/posts/post.router";

const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Configure CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Prisma Blog App");
});

export default app;
