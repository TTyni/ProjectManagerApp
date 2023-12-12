import { Router } from "express";
import {
  getpageById,
  createPage,
  updatePage,
  deletePage,
} from "../services/pageService.js";

const pagesRouter = Router();

pagesRouter.get("/:id(\\d+)", async (req, res) => {
  try {
    if (!req.params.id) throw "params missing";

    const foundPage = await getpageById(req.params.id);
    if (!foundPage) res.status(404).json({ error: "Page not found" });

    res.status(200).send(foundPage);
  } catch (error) {
    console.log(error);
  }
});

pagesRouter.post("/:id(\\d+)", async (req, res) => {
  const { data } = req.body;

  try {
    if (!data || !req.params.id) throw "params missing";

    const foundPage = await getpageById(req.params.id);
    if (foundPage) res.status(400).json({ error: "page already exists." });

    const newPage = await createPage(req.params.id, data);
    res.status(200).send(newPage);
  } catch (error) {
    console.log(error);
  }
});

pagesRouter.delete("/:id(\\d+)", async (req, res) => {
  try {
    if (!req.params.id) throw "params missing";

    const foundPage = await getpageById(req.params.id);
    if (!foundPage) res.status(404).json({ error: "page doesn't exist." });

    const page = await deletePage(req.params.id);
    res.status(200).json({ id: page.id });
  } catch (error) {
    console.log(error);
  }
});

pagesRouter.put("/:id(\\d+)", async (req, res) => {
  const { data } = req.body;
  try {
    if (!data || !req.params.id) throw "params missing";

    const foundPage = await getpageById(req.params.id);
    if (!foundPage) res.status(404).json({ error: "page doesn't exist." });

    const updatedPage = await updatePage(req.params.id, data);
    res.status(200).send(`${updatedPage.name} updated.`);
  } catch (error) {
    console.log(error);
  }
});

export default pagesRouter;
