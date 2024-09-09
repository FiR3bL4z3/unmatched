import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { sendValidationError } from "../utils/send-validation-error";
import { db } from "../db";
import { sendError } from "../utils/send-error";
import { fromPromise } from "neverthrow";
import { handlePrismaError } from "../utils/handle-prisma-error";

const mapsRouter = new Hono()
    // GET /maps
    .get("/", async (c) => {
        const getMapsResult = await fromPromise(
            db.map.findMany(),
            handlePrismaError,
        );

        if (getMapsResult.isErr()) {
            return sendError(c, getMapsResult.error, 500);
        }

        return c.json({
            data: getMapsResult.value,
            ok: true,
        } as const);
    })
    // GET /maps/:id
    .get("/:id", async (c) => {
        const getMapResult = await fromPromise(
            db.map.findUnique({
                where: {
                    id: c.req.param("id"),
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

        return c.json({
            data: getMapResult.value,
            ok: true,
        } as const);
    })
    // POST /maps
    .post(
        "/",
        zValidator(
            "json",
            z.object({
                name: z.string(),
            }),
            sendValidationError("json"),
        ),
        async (c) => {
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

            return c.json({
                data: { id: createMapResult.value.id },
                ok: true,
            } as const);
        },
    );

export { mapsRouter };
