import { hc } from "hono/client";
import type { AppType } from "../../api/src/app";
import createClient from "openapi-fetch";
import { paths } from "./generated/api/v1";

export const client = hc<AppType>("http://localhost:3000");

export const openApiClient = createClient<paths>({
    baseUrl: "http://localhost:3000",
});
