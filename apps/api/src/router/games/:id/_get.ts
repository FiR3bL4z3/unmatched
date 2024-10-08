import { db } from "@app/db";
import { handlePrismaError } from "@app/utils/handle-prisma-error";
import { ErrorSchema, sendError } from "@app/utils/send-error";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { fromPromise } from "neverthrow";

const router = new OpenAPIHono();

const ResponseSchema = z
    .object({
        ok: z.boolean(),
        data: z.object({
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
        }),
    })
    .openapi("Game");

const route = createRoute({
    method: "get",
    path: "/games/{id}",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns a game by id",
        },
        404: {
            content: {
                "application/json": {
                    schema: ErrorSchema,
                },
            },
            description: "Game not found",
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
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
});

router.openapi(route, async (c) => {
    const { id } = c.req.valid("param");

    const getGameResult = await fromPromise(
        db.game.findUnique({
            where: {
                id,
            },
        }),
        handlePrismaError,
    );

    if (getGameResult.isErr()) {
        return sendError(c, getGameResult.error, 500);
    }

    if (getGameResult.value === null) {
        return sendError(c, new Error("Character not found"), 404);
    }

    return c.json(
        {
            data: getGameResult.value,
            ok: true,
        } as const,
        200,
    );
});

export { router };
