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
            name: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
    })
    .openapi("Characters");

const route = createRoute({
    method: "get",
    path: "/characters/{id}",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns a character by id",
        },
        404: {
            content: {
                "application/json": {
                    schema: ErrorSchema,
                },
            },
            description: "Internal server error",
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

    const getCharacterResult = await fromPromise(
        db.character.findUnique({
            where: {
                id,
            },
        }),
        handlePrismaError,
    );

    if (getCharacterResult.isErr()) {
        return sendError(c, getCharacterResult.error, 500);
    }

    if (getCharacterResult.value === null) {
        return sendError(c, new Error("Character not found"), 404);
    }

    return c.json(
        {
            data: getCharacterResult.value,
            ok: true,
        } as const,
        200,
    );
});

export { router };
