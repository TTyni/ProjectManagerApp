import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
} from "../services/userService.js";

const usersRouter = Router();

usersRouter.post(
  "/create",
  async (req, res) => {
    const { email, password } = req.body;

    const foundUser = await getUserByEmail(email);
    if (foundUser) {
      return res.status(404).send({ error: "Email exists" });
    }
    const newUser = await createUser(email, password);
    res.status(200).json({ newUser });
  }
);

usersRouter.get("/getallusers", async (req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

usersRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await getUserById(id);
  if (!user) {
    return res.status(404).send({ error: "Couldnt find user" });
  }
  res.send(user);
});

usersRouter.put(
  "/:id",
  async (req, res) => {
    const id = parseInt(req.params.id);
    const { email, password} = req.body;

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
  }
);

usersRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).send({ error: "Couldnt find user" });
  }
  const deletedUser = await deleteUser(id);
  res.status(200).send({ message: `deleted user ${deletedUser}` });
});

export default usersRouter;
