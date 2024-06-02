import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { sendValidationError } from "../utils/send-validation-error";
import { db } from "../db";
import { sendError } from "../utils/send-error";
import { fromPromise } from "neverthrow";
import { handlePrismaError } from "../utils/handle-prisma-error";

const playersRouter = new Hono()
  // GET /players
  .get("/", async (c) => {
    const getPlayersResult = await fromPromise(
      db.player.findMany(),
      handlePrismaError
    );

    if (getPlayersResult.isErr()) {
      return sendError(c, getPlayersResult.error, 500);
    }

    return c.json({
      data: getPlayersResult.value,
      ok: true,
    } as const);
  })
  // GET /players/:id
  .get("/:id", async (c) => {
    const getPlayerResult = await fromPromise(
      db.player.findUnique({
        where: {
          id: c.req.param("id"),
        },
      }),
      handlePrismaError
    );

    if (getPlayerResult.isErr()) {
      return sendError(c, getPlayerResult.error, 500);
    }

    if (getPlayerResult.value === null) {
      return sendError(c, new Error("Player not found"), 404);
    }

    return c.json({
      data: getPlayerResult.value,
      ok: true,
    } as const);
  })
  // POST /players
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
      }),
      sendValidationError("json")
    ),
    async (c) => {
      const body = c.req.valid("json");

      const createPlayerResult = await fromPromise(
        db.player.create({ data: { name: body.name }, select: { id: true } }),
        handlePrismaError
      );

      if (createPlayerResult.isErr()) {
        return sendError(c, createPlayerResult.error, 500);
      }

      return c.json({
        data: { id: createPlayerResult.value.id },
        ok: true,
      } as const);
    }
  );

export { playersRouter };
