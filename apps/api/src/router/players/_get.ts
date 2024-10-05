import { db } from "@app/db";
import { handlePrismaError } from "@app/utils/handle-prisma-error";
import { ErrorSchema, sendError } from "@app/utils/send-error";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { fromPromise } from "neverthrow";

const router = new OpenAPIHono();

// GET /players
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
    .openapi("HealthCheck");

const route = createRoute({
    method: "get",
    path: "/players",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns all players",
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
    const getPlayersResult = await fromPromise(
        db.player.findMany(),
        handlePrismaError,
    );

    if (getPlayersResult.isErr()) {
        return sendError(c, getPlayersResult.error, 500);
    }

    return c.json(
        {
            data: getPlayersResult.value,
            ok: true,
        } as const,
        200,
    );
});

export { router };
