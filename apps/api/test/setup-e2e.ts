import { setup as baseSetup, teardown as baseTeardown } from "./setup-base.ts";
import { beforeAll, afterAll } from "bun:test";

function setup() {
    baseSetup();
    console.log("E2E setup");
}

function teardown() {
    console.log("E2E teardown");
    baseTeardown();
}

beforeAll(setup);
afterAll(teardown);
