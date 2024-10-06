import { db } from "@app/db";
import { handlePrismaError } from "@app/utils/handle-prisma-error";
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
    .openapi("CreateCharacterResponse");

const route = createRoute({
    method: "post",
    path: "/characters",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "ID of the created character",
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

router.openapi(route, async (c) => {
    const body = c.req.valid("json");

    const createCharacterResult = await fromPromise(
        db.character.create({
            data: { name: body.name },
            select: { id: true },
        }),
        handlePrismaError,
    );

    if (createCharacterResult.isErr()) {
        return sendError(c, createCharacterResult.error, 500);
    }

    return c.json(
        {
            data: { id: createCharacterResult.value.id },
            ok: true,
        } as const,
        200,
    );
});

export { router };
