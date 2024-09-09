import { hc } from "hono/client";
import { AppType } from "../../api/src/app";

export const client = hc<AppType>("http://localhost:3000");
