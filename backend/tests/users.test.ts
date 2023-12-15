import request from "supertest";
import server from "../src/server.js";
import { it, describe, beforeAll, afterAll } from "vitest";

beforeAll(async () => {
  await request(server)
    .post("/user/register")
    .send({ email: "pekka", password: "salainen" });
});

afterAll(async () => {
  await request(server)
    .delete("/user/");
});

describe("Server", () => {
  it("Login with valid data", async () => {
    const response = await request(server)
      .post("/user/login")
      .send({ email: "pekka", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
