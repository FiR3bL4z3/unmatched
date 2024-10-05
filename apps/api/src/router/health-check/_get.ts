import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const router = new OpenAPIHono();

const ResponseSchema = z
    .object({
        status: z.literal("ok"),
    })
    .openapi("HealthCheck");

const route = createRoute({
    method: "get",
    path: "/health-check",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: ResponseSchema,
                },
            },
            description: "Health check ok!",
        },
    },
});

router.openapi(route, async (c) => {
    return c.json({ status: "ok" } as const);
});

export { router };
