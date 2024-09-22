import { spawn } from "node:child_process";
import { parseConfig } from "./parse-config";

// TODO: refactor code with neverthrow

function startServer(startScript: string) {
    console.log("Starting server...");
    const [command, ...args] = startScript.split(" ");
    const serverProcess = spawn(command, args);

    return serverProcess;
}

async function pingServer(healthCheckUrl: string) {
    try {
        const healthCheck = await fetch(healthCheckUrl);
        return { success: healthCheck.ok && healthCheck.status === 200 };
    } catch (error) {
        return { success: false };
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(
    healthCheckUrl: string,
    delayMs: number,
    retries: number,
) {
    for (let i = 0; i < retries; i++) {
        console.log(`Waiting for server... Attempt ${i + 1}`);
        await sleep(delayMs);
        const healthCheck = await pingServer(healthCheckUrl);
        if (healthCheck.success) {
            return;
        }
    }
    throw new Error("Server did not start in time");
}

function generateSchema(generateScript: string) {
    console.log("Generating schema...");

    const [command, ...args] = generateScript.split(" ");
    const generateProcess = spawn(command, args, {
        stdio: "inherit",
    });

    return generateProcess;
}

export async function gen() {
    const config = await parseConfig(`${process.cwd()}/schema-gen.config.ts`);

    const serverProcess = startServer(config.startScript);
    await waitForServer(
        config.healthCheckUrl,
        config.delayBetweenRetriesMs,
        config.retries,
    );
    console.log("Server started successfully");

    const generateProcess = generateSchema(config.generateScript);

    generateProcess.on("exit", (code) => {
        if (code === 0) {
            console.log("Schema generated successfully");
        } else {
            console.error("Schema generation failed");
        }
        serverProcess.kill();
    });
}
