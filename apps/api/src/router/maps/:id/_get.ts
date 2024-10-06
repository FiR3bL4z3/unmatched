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
    .openapi("Map");

const route = createRoute({
    method: "get",
    path: "/maps/{id}",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Returns a map by id",
        },
        404: {
            content: {
                "application/json": {
                    schema: ErrorSchema,
                },
            },
            description: "Map not found",
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

    const getMapResult = await fromPromise(
        db.map.findUnique({
            where: {
                id,
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

    return c.json(
        {
            data: getMapResult.value,
            ok: true,
        } as const,
        200,
    );
});

export { router };
