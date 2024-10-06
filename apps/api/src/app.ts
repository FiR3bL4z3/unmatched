import { cors } from "hono/cors";
import { OpenAPIHono } from "@hono/zod-openapi";

export const app = new OpenAPIHono();

app.use(
    "*",
    cors({
        origin: "*",
    }),
);

app.doc("/openapi-schema", {
    openapi: "3.0.0",
    info: {
        version: "0.1.0",
        title: "Unmatched-API v1",
    },
});

// TODO: refactor this to separate file and call it with createFileRouter(app, ["src", "router"])
// list files in the /router directory
import { readdirSync, lstatSync } from "node:fs";
import path from "node:path";

const routerDir = path.join(process.cwd(), "src", "router");
console.log("ROUTERDIR:  ", routerDir);

readdirSync(routerDir, {
    recursive: true,
}).forEach(async (file) => {
    const fullPath = path.join(routerDir, file.toString());
    const relativePath = "./" + path.relative(__dirname, fullPath);

    if (lstatSync(fullPath).isDirectory()) return;
    console.log("FULL PATH: ", fullPath);
    console.log("THIS: ", __filename);
    console.log("RELATIVE PATH: ", relativePath);

    const module = await import(relativePath);
    const router = module.router;
    console.log(router instanceof OpenAPIHono);
    if (router instanceof OpenAPIHono) {
        app.route("/", router);
    }
});
