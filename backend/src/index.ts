import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/userRouter.js";
dotenv.config();

const server = express();
server.use(cors());
const PORT = process.env.BACKEND_PORT;
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/user", usersRouter);

server.listen(PORT, () => console.log("Listening to port", PORT));
