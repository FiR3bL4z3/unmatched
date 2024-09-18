import { z } from "zod";

export const configSchema = z.object({
    projectTag: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

export const defaultConfig: Required<Config> = {
    projectTag: "TASK",
};
