import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/userRouter.js";
import projectsRouter from "./routes/projectRouter.js";
dotenv.config();

const PORT = process.env.BACKEND_PORT;
const sessionSecret = process.env.BACKEND_SESSION_SECRET!;

const server = express();

server.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/user", usersRouter);
server.use("/projects", projectsRouter);

server.listen(PORT, () => console.log("Listening to port", PORT));
