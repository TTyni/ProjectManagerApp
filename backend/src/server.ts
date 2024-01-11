import express, { type Request } from "express";
import session from "express-session";
import cors from "cors";
import expressWebsockets from "express-ws";
import { Server, type onAuthenticatePayload } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { Database } from "@hocuspocus/extension-database";
import * as Y from "yjs";
import usersRouter from "./routes/userRouter.js";
import projectsRouter from "./routes/projectRouter.js";
import requestLog from "./middlewares/requestLog.js";
import unknownEndpoint from "./middlewares/unknownEndpoint.js";
import pagesRouter from "./routes/pageRouter.js";
import authenticate from "./middlewares/authenticate.js";

const sessionSecret = process.env.BACKEND_SESSION_SECRET!;
const PORT = process.env.BACKEND_PORT!;

interface onAuthenticatePayloadWithRequest extends onAuthenticatePayload {
  request: Request;
}

const ydoc = new Y.Doc;

const hocuspocusServer = Server.configure({
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        return new Promise((resolve, reject) => {
          resolve(Y.encodeStateAsUpdate(ydoc));
        });
      },
      store: async ({ documentName, state }) => {
        return new Promise((resolve, reject) => {
          resolve(Y.applyUpdate(ydoc,state));
        });
      },
    }),
  ],
  port: Number(PORT),
  name: "example-document",
  // eslint-disable-next-line @typescript-eslint/require-await
  async onAuthenticate(data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { request } = data as onAuthenticatePayloadWithRequest;
    // console.log(data.requestHeaders);
    // console.log(data.request);
    // data.requestParameters
    // const token =
    const sessionUserId = request.session.userId;
    if (!sessionUserId) {
      throw new Error("Not authorized!");
    }
    console.log("onAuthenticate", sessionUserId);

    // Example test if a user is authenticated with a token passed from the client
    // if (!sessionUserId) {
    //   throw new Error("Not authorized!");
    // }

    // You can set contextual data to use it in other hooks
    return {
      user: {
        id: sessionUserId ?? 0,
        name: "John",
      },
    };
  },
});

const { app } = expressWebsockets(express());

app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLog);

app.use("/users", usersRouter);
app.use("/projects", authenticate, projectsRouter);
app.use("/pages", authenticate, pagesRouter);

app.ws("/collaboration", (websocket, request) => {
  console.log("hokkuspokkus");
  console.log(request.session.userId);
  // websocket.send("jou");
  // if(!request.session.userId){
  //   console.log("ei ole");
  //   // websocket.send("hhohoo");
  //   websocket.send("HTTP/1.1 401 Unauthorized\r\n\r\n");
  //   // websocket.terminate();

  //   return;

  // }

  hocuspocusServer.handleConnection(websocket, request);

});

app.use(unknownEndpoint);

export default app;
