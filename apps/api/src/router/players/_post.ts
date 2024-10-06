import { db } from "@app/db";
import { handlePrismaError } from "@app/utils/handle-prisma-error";
import { ErrorSchema, sendError } from "@app/utils/send-error";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { fromPromise } from "neverthrow";

const ResponseSchema = z
    .object({
        data: z.object({
            id: z.string(),
        }),
        ok: z.literal(true),
    })
    .openapi("CreatePlayerResponse");

const route = createRoute({
    method: "post",
    path: "/players",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "ID of the created player",
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
                        name: z.string(),
                    }),
                },
            },
        },
    },
});

const router = new OpenAPIHono();
router.openapi(route, async (c) => {
    const body = c.req.valid("json");

    const createPlayerResult = await fromPromise(
        db.player.create({
            data: { name: body.name },
            select: { id: true },
        }),
        handlePrismaError,
    );

    if (createPlayerResult.isErr()) {
        return sendError(c, createPlayerResult.error, 500);
    }

    return c.json(
        {
            data: { id: createPlayerResult.value.id },
            ok: true,
        } as const,
        200,
    );
});

export { router };
