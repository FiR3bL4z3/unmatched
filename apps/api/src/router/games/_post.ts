import { db } from "@app/db";
import { handlePrismaError } from "@app/utils/handle-prisma-error";
import { NotFoundError } from "@app/utils/not-found-error";
import { ErrorSchema, sendError } from "@app/utils/send-error";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { fromPromise } from "neverthrow";

const router = new OpenAPIHono();

const ResponseSchema = z
    .object({
        data: z.object({
            id: z.string(),
        }),
        ok: z.literal(true),
    })
    .openapi("CreateGameResponse");

const route = createRoute({
    method: "post",
    path: "/games",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "ID of the created game",
        },
        400: {
            content: {
                "application/json": {
                    schema: ErrorSchema,
                },
            },
            description: "Bad request",
        },
        404: {
            content: {
                "application/json": {
                    schema: ErrorSchema,
                },
            },
            description: "Not found",
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
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        datetime: z.object({
                            year: z.number().int().min(1),
                            month: z.number().int().min(1).max(12),
                            day: z.number().int().min(1).max(31),
                            hour: z.number().int().min(0).max(23),
                            minute: z.number().int().min(0).max(59),
                        }),
                        player1Id: z.string(),
                        player2Id: z.string(),
                        mapId: z.string(),
                        character1Id: z.string(),
                        character2Id: z.string(),
                        winner: z.number().int().min(1).max(2),
                    }),
                },
            },
        },
    },
});

router.openapi(route, async (c) => {
    const body = c.req.valid("json");

    const getPlayer1Result = await fromPromise(
        db.player.findUnique({
            where: {
                id: body.player1Id,
            },
        }),
        handlePrismaError,
    );

    if (getPlayer1Result.isErr()) {
        return sendError(c, getPlayer1Result.error, 500);
    }
    if (getPlayer1Result.value === null) {
        return sendError(c, new NotFoundError("Player 1 not found"), 404);
    }

    const getPlayer2Result = await fromPromise(
        db.player.findUnique({
            where: {
                id: body.player2Id,
            },
        }),
        handlePrismaError,
    );

    if (getPlayer2Result.isErr()) {
        return sendError(c, getPlayer2Result.error, 500);
    }
    if (getPlayer2Result.value === null) {
        return sendError(c, new NotFoundError("Player 2 not found"), 404);
    }

    if (body.player1Id === body.player2Id) {
        return sendError(
            c,
            new Error("Player 1 and Player 2 must be different"),
            400,
        );
    }

    const getMapResult = await fromPromise(
        db.map.findUnique({
            where: {
                id: body.mapId,
            },
        }),
        handlePrismaError,
    );

    if (getMapResult.isErr()) {
        return sendError(c, getMapResult.error, 500);
    }
    if (getMapResult.value === null) {
        return sendError(c, new Error("Map not found"), 404);
    }

    const getCharacter1Result = await fromPromise(
        db.character.findUnique({
            where: {
                id: body.character1Id,
            },
        }),
        handlePrismaError,
    );

    if (getCharacter1Result.isErr()) {
        return sendError(c, getCharacter1Result.error, 500);
    }
    if (getCharacter1Result.value === null) {
        return sendError(c, new Error("Character 1 not found"), 404);
    }

    const getCharacter2Result = await fromPromise(
        db.character.findUnique({
            where: {
                id: body.character2Id,
            },
        }),
        handlePrismaError,
    );

    if (getCharacter2Result.isErr()) {
        return sendError(c, getCharacter2Result.error, 500);
    }
    if (getCharacter2Result.value === null) {
        return sendError(c, new Error("Character 2 not found"), 404);
    }

    const createGameResult = await fromPromise(
        db.game.create({
            data: {
                mapId: body.mapId,
                player1Id: body.player1Id,
                player2Id: body.player2Id,
                character1Id: body.character1Id,
                character2Id: body.character2Id,
                winner: body.winner,

                date: new Date(
                    body.datetime.year,
                    body.datetime.month - 1,
                    body.datetime.day,
                    body.datetime.hour,
                    body.datetime.minute,
                ),
            },
            select: { id: true },
        }),
        (error) => new Error(`PrismaError: ${JSON.stringify(error)}`),
    );

    if (createGameResult.isErr()) {
        return sendError(c, createGameResult.error, 500);
    }

    return c.json(
        {
            data: { id: createGameResult.value.id },
            ok: true,
        } as const,
        200,
    );
});

export { router };
