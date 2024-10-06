import { test } from "bun:test";

type TestParams = Parameters<typeof test>;

export function unitTest(...params: TestParams) {
    const [label, ...rest] = params;
    test(`__UNIT: ${label}`, ...rest);
}

export function integrationTest(...params: TestParams) {
    const [label, ...rest] = params;
    test(`__INTEGRATION: ${label}`, ...rest);
}

export function e2eTest(...params: TestParams) {
    const [label, ...rest] = params;
    test(`__E2E: ${label}`, ...rest);
}
