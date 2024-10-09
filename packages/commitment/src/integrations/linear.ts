import { LinearClient } from "@linear/sdk";
import {
    createTaskManagerIntegration,
    GetTasksByProjectResult,
    Task,
} from "./task-manager-integration";
import { fromPromise } from "neverthrow";

export async function getTasksByProject(
    client: LinearClient,
    projectName: string,
): GetTasksByProjectResult {
    const issuesResult = await fromPromise(
        client.issues({
            filter: {
                project: {
                    name: {
                        eq: projectName,
                    },
                },
            },
        }),
        () => ({ message: "Failed to fetch tasks" }), // TODO: better error message
    );

    if (issuesResult.isErr()) {
        return {
            ok: false,
            error: {
                message: issuesResult.error.message,
            },
        };
    }

    const mappedIssues = issuesResult.value.nodes.map((issue) => ({
        title: issue.title,
        id: issue.id,
        description: issue.description,
        project: projectName,
    })) satisfies Task[];

    return {
        ok: true,
        tasks: mappedIssues,
    };
}

export const LinearIntegration = createTaskManagerIntegration(
    (apiKey: string) => {
        const client = new LinearClient({
            apiKey,
        });

        return {
            getTasksByProject: async (project: string) =>
                getTasksByProject(client, project),
        };
    },
);
