import { db } from "@app/db";
import { handlePrismaError } from "@app/utils/handle-prisma-error";
import { ErrorSchema, sendError } from "@app/utils/send-error";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { fromPromise } from "neverthrow";

const router = new OpenAPIHono();

const ResponseSchema = z
    .object({
        ok: z.boolean(),
        data: z
            .object({
                id: z.string(),
                name: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
            })
            .array(),
    })
    .openapi("");

const route = createRoute({
    method: "get",
    path: "/maps",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns all maps",
        },
        500: {
            content: {
                "application/json": {
                    schema: ErrorSchema,
                },
            },
            description: "Internal server error",
        },
    },
});

router.openapi(route, async (c) => {
    const getMapsResult = await fromPromise(
        db.map.findMany(),
        handlePrismaError,
    );

    if (getMapsResult.isErr()) {
        return sendError(c, getMapsResult.error, 500);
    }

    return c.json(
        {
            data: getMapsResult.value,
            ok: true,
        } as const,
        200,
    );
});

export { router };
