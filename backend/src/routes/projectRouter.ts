import { Router } from "express";

import {
  removeUserFromProject,
  addUserToProject,
  changeUserRoleOnProject,
  createNewProject,
  deleteProject,
  getAllProjectsByUserId,
  getProjectAllDetailsById,
  getProjectById,
  updateProject,
  checkForUserExistingOnProject,
} from "../services/projectService.js";
import { getUserById } from "../services/userService.js";
import { Role } from "@prisma/client";

const projectsRouter = Router();

projectsRouter.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ error: "Missing project name" });
  }
  const newProject = await createNewProject(name);
  res.status(200).send( newProject );
});

projectsRouter.get("/", async (req, res) => {
  // edit user id later
  const userId = 1;
  const usersProjects = await getAllProjectsByUserId(userId);
  if (!usersProjects) {
    return res.status(404).send({ error: "Couldnt find user projects" });
  }

  res.json(usersProjects);
});

projectsRouter.delete("/:pid(\\d+)", async (req, res) => {
  const id = parseInt(req.params.pid);
  const project = await getProjectById(id);
  if (!project) {
    return res.status(404).send({ error: "Couldnt find project" });
  }
  const deletedProject = await deleteProject(id);

  res.status(200).send(deletedProject);
});

projectsRouter.put("/:pid(\\d+)", async (req, res) => {
  const id = parseInt(req.params.pid);
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Missing project name" });
  }

  const project = await getProjectById(id);
  if (!project) {
    return res.status(404).send({ error: "Couldnt find project" });
  }

  const updatedProject = await updateProject(id, name);
  res.json(updatedProject);
});

projectsRouter.get("/:pid(\\d+)", async (req, res) => {
  const id = parseInt(req.params.pid);

  const project = await getProjectById(id);
  if (!project) {
    return res.status(404).send({ error: "Couldnt find project" });
  }

  const allProjectDetails = await getProjectAllDetailsById(id);
  res.json(allProjectDetails);
});

projectsRouter.post("/:pid(\\d+)/users/:uid(\\d+)", async (req, res) => {
  const projectId = parseInt(req.params.pid);
  const userId = parseInt(req.params.uid);
  const { role } = req.body;
  if (!role) {
    return res.status(400).send({ error: "Missing role" });
  }
  if (role !== Role.manager && role !== Role.editor && role !== Role.viewer) {
    return res.status(400).send({ error: "Wrong role" });
  }
  const findUser = await getUserById(userId);
  if (!findUser) {
    return res.status(404).send({ error: "Couldnt find user" });
  }
  const findProject = await getProjectById(projectId);
  if (!findProject) {
    return res.status(404).send({ error: "Couldnt find project" });
  }
  const findExistingUser = await checkForUserExistingOnProject(
    userId,
    projectId
  );

  if (findExistingUser) {
    return res.status(400).send({ error: "User is already on this project" });
  }
  const newUserToProject = await addUserToProject(userId, projectId, role);

  res.json(newUserToProject);
});

projectsRouter.put("/:pid(\\d+)/users/:uid(\\d+)", async (req, res) => {
  const projectId = parseInt(req.params.pid);
  const userId = parseInt(req.params.uid);
  const { role } = req.body;
  if (!role) {
    return res.status(400).send({ error: "Missing role" });
  }

  if (role !== Role.manager && role !== Role.editor && role !== Role.viewer) {
    return res.status(400).send({ error: "Wrong role" });
  }

  const findUser = await getUserById(userId);
  if (!findUser) {
    return res.status(404).send({ error: "Couldnt find user" });
  }
  const findProject = await getProjectById(projectId);
  if (!findProject) {
    return res.status(404).send({ error: "Couldnt find project" });
  }
  const findExistingUser = await checkForUserExistingOnProject(
    userId,
    projectId
  );
  if (!findExistingUser) {
    return res.status(400).send({ error: "User is not on the project" });
  }
  const newUserToProject = await changeUserRoleOnProject(
    userId,
    projectId,
    role
  );

  res.json(newUserToProject);
});

projectsRouter.delete("/:pid(\\d+)/users/:uid(\\d+)", async (req, res) => {
  const projectId = parseInt(req.params.pid);
  const userId = parseInt(req.params.uid);

  const findUser = await getUserById(userId);
  if (!findUser) {
    return res.status(404).send({ error: "Couldnt find user" });
  }
  const findProject = await getProjectById(projectId);
  if (!findProject) {
    return res.status(404).send({ error: "Couldnt find project" });
  }

  const findExistingUser = await checkForUserExistingOnProject(
    userId,
    projectId
  );
  if (!findExistingUser) {
    return res.status(400).send({ error: "User is not on the project" });
  }

  const deletedUserFromProject = await removeUserFromProject(userId, projectId);

  res.json(deletedUserFromProject);
});
export default projectsRouter;
