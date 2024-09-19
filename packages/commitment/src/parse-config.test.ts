import { describe, expect, test } from "bun:test";
import { parseConfig } from "./parse-config";
import { defaultConfig } from "./config";

describe("parseConfig", () => {
    test("parseConfig to return default config if config file is not present", async () => {
        const config = await parseConfig("./not/a/real/config/file.ts");

        expect(config).toEqual(defaultConfig);
    });

    test("parseConfig to return default config if config file does not have a default export", async () => {
        const config = await parseConfig(
            `${process.cwd()}/example-configs/empty.config.ts`,
        );

        expect(config).toEqual(defaultConfig);
    });

    test("parseConfig to return default config if config file does not match schema", async () => {
        const config = await parseConfig(
            `${process.cwd()}/example-configs/invalid.config.ts`,
        );

        expect(config).toEqual(defaultConfig);
    });

    test("parseConfig to return user config if config file is valid", async () => {
        console.log(process.cwd());
        const config = await parseConfig(
            "./example-configs/commitment.config.ts",
        );

        expect(config).toEqual({
            projectTag: "UNM",
            subProjectTags: [
                { name: "Client (app)", value: "WEB" },
                { name: "Api (app)", value: "API" },
                { name: "Commitment (package)", value: "CMT" },
            ],
            types: [
                {
                    name: "Feature",
                    value: "feat",
                },
                {
                    name: "Fix",
                    value: "fix",
                },
                {
                    name: "Refactor",
                    value: "refactor",
                },
                {
                    name: "Test",
                    value: "test",
                },
                {
                    name: "Docs",
                    value: "docs",
                },
                {
                    name: "Chore",
                    value: "chore",
                },
            ],
        });
    });
});
