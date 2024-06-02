import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { sendValidationError } from "../utils/send-validation-error";
import { db } from "../db";
import { sendError } from "../utils/send-error";
import { fromPromise } from "neverthrow";
import { handlePrismaError } from "../utils/handle-prisma-error";

const charactersRouter = new Hono()
  // GET /characters
  .get("/", async (c) => {
    const getCharactersResult = await fromPromise(
      db.character.findMany(),
      handlePrismaError
    );

    if (getCharactersResult.isErr()) {
      return sendError(c, getCharactersResult.error, 500);
    }

    return c.json({
      data: getCharactersResult.value,
      ok: true,
    } as const);
  })
  // GET /characters/:id
  .get("/:id", async (c) => {
    const getCharacterResult = await fromPromise(
      db.character.findUnique({
        where: {
          id: c.req.param("id"),
        },
      }),
      handlePrismaError
    );

    if (getCharacterResult.isErr()) {
      return sendError(c, getCharacterResult.error, 500);
    }

    if (getCharacterResult.value === null) {
      return sendError(c, new Error("Character not found"), 404);
    }

    return c.json({
      data: getCharacterResult.value,
      ok: true,
    } as const);
  })
  // POST /characters
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

      const createCharacterResult = await fromPromise(
        db.character.create({
          data: { name: body.name },
          select: { id: true },
        }),
        handlePrismaError
      );

      if (createCharacterResult.isErr()) {
        return sendError(c, createCharacterResult.error, 500);
      }

      return c.json({ data: { id: createCharacterResult.value.id } });
    }
  );

export { charactersRouter };
