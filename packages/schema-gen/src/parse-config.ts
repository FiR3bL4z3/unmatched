import { defaultPartialConfig, userConfigSchema } from "./config";

// TODO: refactor to neverthrow

export async function parseConfig(configFilePath: string) {
    const configFile = await import(configFilePath);

    try {
        if (!configFile.default) {
            throw new Error("No default export found in commitment.config.ts");
        }

        const userConfig = userConfigSchema.parse(configFile.default);
        return { ...defaultPartialConfig, ...userConfig };
    } catch {
        throw new Error("Invalid config file");
    }
}
