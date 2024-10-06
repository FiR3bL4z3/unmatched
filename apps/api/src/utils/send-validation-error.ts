import { Context } from "hono";
import { fromError } from "zod-validation-error";

export const sendValidationError = (
    target: "query" | "param" | "json" | "header" | "cookie",
) => {
    return (
        result: { success: boolean; data?: unknown; error?: unknown },
        c: Context,
    ) => {
        if (!result.success) {
            return c.json(
                {
                    path: c.req.path,
                    target,
                    description: fromError(result.error).toString(),
                    error: result.error,
                    ok: false,
                } as const,
                400,
            );
        }
    };
};
