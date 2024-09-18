import { z } from "zod";

type WithNonNullableKeys<T> = {
    [K in keyof T]-?: NonNullable<T[K]>;
};

type WithRequiredKeys<T, K extends keyof T> = WithNonNullableKeys<
    Required<Pick<T, K>>
> &
    Omit<T, K>;

export const configSchema = z.object({
    projectTag: z.string().optional(),
    subProjectTags: z
        .array(
            z.object({
                name: z.string(),
                value: z.string(),
            }),
        )
        .optional(),
});

export type Config = z.infer<typeof configSchema>;

export type ConfigWithDefaults = WithRequiredKeys<Config, "projectTag">;

export const defaultConfig: ConfigWithDefaults = {
    projectTag: "TASK",
};
