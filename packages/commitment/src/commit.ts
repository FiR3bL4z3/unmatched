#!/usr/bin/env bun
import { input, select, number } from "@inquirer/prompts";
import { $ } from "bun";
import { parseConfig } from "./parse-config";
import { LinearIntegration } from "./integrations/linear";

export async function commit() {
    const config = await parseConfig(`${process.cwd()}/commitment.config.ts`);

    // Prompt for subproject tag if it exists
    const subProjectTag =
        config.subProjectTags &&
        (await select({
            message: "What subproject is this commit for?",
            choices: config.subProjectTags,
            loop: true,
        }));

    // const taskManagerIntegration = LinearIntegration(apiKey);

    // const tasks = await taskManagerIntegration.getTasksByProject(
    //     subProjectTag ?? "",
    // );
    // console.log("Tasks fetched successfully");
    // console.log(tasks);

    // Prompt for the type of commit
    const type = await select({
        message: "What type of commit is this?",
        choices: config.types,
        default: "feat",
        loop: true,
    });

    // Prompt if the commit has a task id
    const hasTaskId = await select({
        message: "Does this commit have a task id?",
        choices: [
            { name: "Yes", value: true },
            { name: "No", value: false },
        ],
        default: true,
        loop: true,
    });

    // Prompt for task id
    const taskId = hasTaskId
        ? await number({
              message: "Enter the task id:",
              required: true,
          })
        : undefined;

    // Prompt for the commit message
    const message = await input({
        message: "Enter the commit message",
        required: true,
    });

    const commitMessage = `${type}: ${taskId ? `[${config.projectTag}${subProjectTag ? `/${subProjectTag}` : ""}-${taskId}] ` : ""}${message}`;

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
}
