import { describe, expect } from "bun:test";
import { app } from "../src/app";
import { e2eTest } from "@utils/test";

describe("GET /maps", () => {
    e2eTest("should return 200", async () => {
        const res = await app.request("/maps");
        expect(res.status).toBe(200);
    });
});
