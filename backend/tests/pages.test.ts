/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {agent} from "supertest";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import server from "../src/server.js";


const request = agent(server);

let projectid = 0;
let pageid = 0;


beforeAll(async () => {
  await request
    .post("/users/register")
    .send({ email: "test2@mail.com", name: "pekka", password: "salainen" });

  await request
    .post("/users/login")
    .send({ email: "test2@mail.com", password: "salainen" });

  const testProject = await request.post("/projects/").send({ name: "testproject2" });

  projectid = testProject.body.id;
});


afterAll(async () => {
  await request
    .post("/users/login")
    .send({ email: "test@mail.com", password: "salainen" });
  await request
    .delete("/users/delete/" + projectid);
  await request
    .delete("/pages/delete/" + pageid);
});

describe("server", () => {

  //create page
  it("create new page", async () => {
    const res = await request
      .post("/pages/")
      .send({ name: "testpage", projectid: projectid })
      .expect(200)
      .expect("content-type", /json/);
    expect(res.body.id);
    pageid = res.body.id;
  });

  it("try to create page with missing name", async () => {
    const res = await request
      .post("/pages/")
      .send({projectid: projectid })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to create page with missing projectid", async () => {
    const res = await request
      .post("/pages/")
      .send({name: "pagetest" })
      .expect(400)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });


  //get page
  it("get page by id", async () => {
    const res = await request
      .get("/pages/" + pageid)
      .expect(200)
      .expect("content-type", /json/);
    expect(res.body.id).toBeDefined();
  });

  it("get page by wrong id", async () => {
    const res = await request
      .get("/pages/100000000")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  it("try to get page with no id", async () => {
    const res = await request
      .get("/pages/")
      .expect(404)
      .expect("content-type", /json/);
    expect(res.body.error).toBeDefined();
  });

  //update page

  it("update page", async () => {
    const res = await request
      .put("/pages/" + pageid)
      .send({name: "pagetestupdate", projectid: projectid})
      .expect(200);
    expect(res.body.id);
  });

  it("update page with no id", async () => {
    const res = await request
      .put("/pages/")
      .send({name: "pagetestupdate", projectid: projectid})
      .expect(404);
    expect(res.body.error);
  });

  it("update page missing parameters", async () => {
    const res = await request
      .put("/pages/" + pageid)
      .send({})
      .expect(400);
    expect(res.body.error);
  });


  //delete page
  it("delete page", async () => {
    const res = await request
      .delete("/pages/" + pageid)
      .expect(200);
    expect(res.body.id);
  });

  it("try to delete page with no id", async () => {
    const res = await request
      .delete("/pages/")
      .expect(404);
    expect(res.body.id);
  });

});
