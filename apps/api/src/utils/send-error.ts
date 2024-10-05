import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { z } from "@hono/zod-openapi";

export const ErrorSchema = z
    .object({
        path: z.string(),
        description: z.string(),
        ok: z.literal(false),
    })
    .openapi("APIError");

export const sendError = <Key extends StatusCode>(
    c: Context,
    error: Error,
    status?: Key,
) => {
    const content: z.infer<typeof ErrorSchema> = {
        path: c.req.path,
        description: error.message,
        ok: false,
    };

    return c.json(content, status ?? 500);
};
