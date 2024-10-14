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
        }),
    })
    .openapi("DeletedPlayerResponse");

const route = createRoute({
    method: "delete",
    path: "/players/{id}",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns the deleted player by id",
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
        params: z.object({
            id: z.string(),
        }),
    },
});

router.openapi(route, async (c) => {
    const { id } = c.req.valid("param");

    const deletePlayerResult = await fromPromise(
        db.player.delete({
            where: {
                id,
            },
        }),
        handlePrismaError,
    );

    if (deletePlayerResult.isErr()) {
        return sendError(c, deletePlayerResult.error, 500);
    }

    return c.json(
        {
            data: { id: deletePlayerResult.value.id },
            ok: true,
        } as const,
        200,
    );
});

export { router };
