import { z } from "zod";

export const userConfigSchema = z.object({
    healthCheckUrl: z.string(),
    startScript: z.string(),
    generateScript: z.string(),
    delayBetweenRetriesMs: z.number().optional(),
    retries: z.number().optional(),
});

export type UserConfig = z.infer<typeof userConfigSchema>;

export type Config = {
    healthCheckUrl: string;
    startScript: string;
    generateScript: string;
    delayBetweenRetriesMs: number;
    retries: number;
};

export const defaultPartialConfig: Pick<
    Config,
    "delayBetweenRetriesMs" | "retries"
> = {
    delayBetweenRetriesMs: 1000,
    retries: 10,
};
