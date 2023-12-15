import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
} from "../services/userService.js";
import authenticate from "../middlewares/authenticate.js";

const usersRouter = Router();

usersRouter.post("/register", async (req, res, next) => {
  // Username missing and password hashing
  const { email, password } = req.body;

  if( !email || !password || typeof email === "string" || typeof password === "string") {
    return res.status(400).json({error: "Missing email or password"});
  }

  const foundUser = await getUserByEmail(email);
  if (foundUser) {
    return res.status(409).send({ error: "Email already exists" });
  }
  const newUser = await createUser(email, password);
  req.session.regenerate((err) => {
    if (err) next();
    req.session.userId = newUser.id;
    res.status(200).json({ newUser });
  });
});

usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await getUserByEmail(email);
  if (!foundUser || foundUser.password !== password) {
    return res.status(401).send({ error: "Email and password does not match" });
  }
  req.session.regenerate((err) => {
    if (err) next();
    req.session.userId = foundUser.id;
    res.status(200).json({ foundUser });
  });
});

usersRouter.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    return res.status(204).end();
  });
});

usersRouter.get("/getallusers", authenticate, async (req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

usersRouter.get("/:id(\\d+)", authenticate, async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await getUserById(id);
  if (!user) {
    return res.status(404).send({ error: "Couldnt find user" });
  }
  res.send(user);
});

usersRouter.put("/:id(\\d+)", authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  const { email, password } = req.body;

  if (!email && !password) {
    return res
      .status(400)
      .send({ error: "Empty req body" });
  }

  const user = await getUserById(id);
  if (!user) {
    return res.status(404).send({ error: "Couldnt find user" });
  }

  if (email) {
    const findUserEmail = await getUserByEmail(email);
    if (findUserEmail) {
      return res.status(404).send({ error: "Email exists" });
    }
    user.email = email;
  }
  if (password) {
    user.password = password;
  }
  const updatedUser = await updateUser(id, user);
  res.send(updatedUser);
});

usersRouter.delete("/", authenticate, async (req, res) => {
  const id = req.session.userId!;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).send({ error: "Couldnt find user" });
  }
  const deletedUser = await deleteUser(id);
  res.status(200).send({ message: `deleted user ${deletedUser}` });
});

export default usersRouter;
