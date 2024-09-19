import { Config, defaultConfig, userConfigSchema } from "./config";

export async function parseConfig(configFilePath: string) {
    // import config file commitment.config.ts from project root if it exists
    let config: Config;
    try {
        const configFile = await import(configFilePath);

        if (!configFile.default) {
            throw new Error("No default export found in commitment.config.ts");
        }

        const { types, ...userConfig } = userConfigSchema.parse(
            configFile.default,
        );

        config = {
            ...defaultConfig,
            ...userConfig,
            types: types
                ? types.extend
                    ? [...defaultConfig.types, ...types.extend]
                    : types.override
                : defaultConfig.types,
        };
    } catch {
        config = defaultConfig;
    }

    return config;
}
