import { app } from "./app";

const PORT = 3000;

console.log(`Deploying server on http://localhost:${PORT}`);

Bun.serve({
    port: PORT,
    fetch: app.fetch,
});
