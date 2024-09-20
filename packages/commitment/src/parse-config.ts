import { Config, defaultConfig, userConfigSchema } from "./config";

export async function parseConfig(configFilePath: string) {
    // import config file commitment.config.ts from project root if it exists
    let config: Config;
    try {
        const configFile = await import(configFilePath);

        if (!configFile.default) {
            throw new Error("No default export found in commitment.config.ts");
        }

        const { types: userTypes, ...userConfig } = userConfigSchema.parse(
            configFile.default,
        );

        const types = userTypes
            ? userTypes.extend
                ? [...defaultConfig.types, ...userTypes.extend]
                : userTypes.override
            : defaultConfig.types;

        config = {
            ...defaultConfig,
            ...userConfig,
            types: types.filter(
                (t, i) =>
                    i === types.findLastIndex((tt) => tt.value === t.value),
            ),
        };
    } catch {
        config = defaultConfig;
    }

    return config;
}
