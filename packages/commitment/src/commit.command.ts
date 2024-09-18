#!/usr/bin/env bun
import { input, select, number } from "@inquirer/prompts";
import { $, argv } from "bun";
import { Config, configSchema, defaultConfig } from "./config";

// import config file commitment.config.ts from project root if it exists
let config: Config;
try {
    const configFile = await import(`${process.cwd()}/commitment.config.ts`);

    if (!configFile.default) {
        throw new Error("No default export found in commitment.config.ts");
    }

    config = { ...defaultConfig, ...configSchema.parse(configFile.default) };
} catch {
    config = defaultConfig;
}

// Prompt for the type of commit
const type = await select({
    message: "What type of commit is this?",
    choices: [
        { name: "Feature", value: "feat" },
        { name: "Fix", value: "fix" },
        { name: "Refactor", value: "refactor" },
        { name: "Test", value: "test" },
        { name: "Docs", value: "docs" },
    ],
    default: "feat",
    loop: true,
});

// Prompt for task id
const taskId = await number({
    message: "Enter the task id:",
    required: true,
});

// Prompt for the commit message
const message = await input({
    message: "Enter the commit message",
    required: true,
});

const commitMessage = `${type}: [${config.projectTag}-${taskId}] ${message}`;

const separator = "-".repeat(commitMessage.length);

// Print the commit message and ask if it is correct
console.log(
    `Your commit message will be:\n${separator}\n${commitMessage}\n${separator}`,
);
const confirm = await select({
    message: "Is this correct?",
    choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
    ],
    default: true,
    loop: true,
});

if (!confirm) {
    console.log("Commit aborted");
    process.exit(0);
}

// Run the git commit command
const { exitCode } = await $`git commit -m "${commitMessage}"`
    .nothrow()
    .quiet();

if (exitCode !== 0) {
    console.error("Error committing changes");
    process.exit(1);
}

console.log("Changes committed successfully");
