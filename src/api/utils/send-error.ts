import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export const sendError = (c: Context, error: Error, status?: StatusCode) => {
    return c.json(
        {
            path: c.req.path,
            description: error.message,
            ok: false,
        } as const,
        status ?? 500,
    );
};
