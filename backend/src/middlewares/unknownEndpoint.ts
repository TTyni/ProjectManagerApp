import type { Request, Response } from "express";

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
};

export default unknownEndpoint;
