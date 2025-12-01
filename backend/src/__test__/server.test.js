// src/__test__/server.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../server"; 
import { connectDB, getDB, client } from "../db";

describe("Server and MongoDB connection", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await client.close();
  });

  it("should connect to MongoDB", () => {
    const db = getDB();
    expect(db).toBeDefined();
  });

  it("should respond on the health-check endpoint /", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Backend running ✔" });
  });
});