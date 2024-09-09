import { Hono } from "hono";
import { playersRouter } from "./routers/players-router";
import { mapsRouter } from "./routers/maps-router";
import { charactersRouter } from "./routers/characters-router";
import { gamesRouter } from "./routers/games-router";
import { cors } from "hono/cors";

export const app = new Hono()
    .use(
        "*",
        cors({
            origin: "*",
        }),
    )
    .get("/health-check", async (c) => {
        return c.json({ status: "ok" });
    })
    .route("/players", playersRouter)
    .route("/maps", mapsRouter)
    .route("/characters", charactersRouter)
    .route("/games", gamesRouter);

export type AppType = typeof app;
