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
                mapId: z.string(),
                player1Id: z.string(),
                player2Id: z.string(),
                character1Id: z.string(),
                character2Id: z.string(),
                winner: z.number(),
                date: z.date(),
                createdAt: z.date(),
                updatedAt: z.date(),
            })
            .array(),
    })
    .openapi("Games");

const route = createRoute({
    method: "get",
    path: "/games",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns all games",
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
    const getGamesResult = await fromPromise(
        db.game.findMany(),
        handlePrismaError,
    );

    if (getGamesResult.isErr()) {
        return sendError(c, getGamesResult.error, 500);
    }

    return c.json(
        {
            data: getGamesResult.value,
            ok: true,
        } as const,
        200,
    );
});

export { router };
