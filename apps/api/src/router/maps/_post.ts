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
    .openapi("CreateMapResponse");

const route = createRoute({
    method: "post",
    path: "/maps",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "ID of the created map",
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

    const createMapResult = await fromPromise(
        db.map.create({
            data: { name: body.name },
            select: { id: true },
        }),
        handlePrismaError,
    );

    if (createMapResult.isErr()) {
        return sendError(c, createMapResult.error, 500);
    }

    return c.json(
        {
            data: { id: createMapResult.value.id },
            ok: true,
        } as const,
        200,
    );
});

export { router };
