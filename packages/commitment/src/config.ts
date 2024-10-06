import { z } from "zod";

const nameAndValueSchema = z.object({
    name: z.string(),
    value: z.string(),
}); // TODO: better name

export const userConfigSchema = z.object({
    projectTag: z.string().optional(),
    subProjectTags: z.array(nameAndValueSchema).optional(),
    types: z
        .union([
            z.object({
                extend: z.array(nameAndValueSchema),
                override: z.never().optional(),
            }),
            z.object({
                extend: z.never().optional(),
                override: z.array(nameAndValueSchema),
            }),
        ])
        .optional(),
});

export type UserConfig = z.infer<typeof userConfigSchema>;

export type Config = {
    projectTag: string;
    subProjectTags?: { name: string; value: string }[];
    types: { name: string; value: string }[];
};

export const defaultConfig: Config = {
    projectTag: "TASK",
    types: [
        { name: "Feature", value: "feat" },
        { name: "Fix", value: "fix" },
        { name: "Refactor", value: "refactor" },
        { name: "Test", value: "test" },
        { name: "Docs", value: "docs" },
    ],
    subProjectTags: [
        {
            name: "None",
            value: "",
        },
    ],
};
