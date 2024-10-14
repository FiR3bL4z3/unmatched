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
    .openapi("DeletedMapResponse");

const route = createRoute({
    method: "delete",
    path: "/maps/{id}",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns the deleted map by id",
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

    const deleteMapResult = await fromPromise(
        db.map.delete({
            where: {
                id,
            },
        }),
        handlePrismaError,
    );

    if (deleteMapResult.isErr()) {
        return sendError(c, deleteMapResult.error, 500);
    }

    return c.json(
        {
            data: { id: deleteMapResult.value.id },
            ok: true,
        } as const,
        200,
    );
});

export { router };
