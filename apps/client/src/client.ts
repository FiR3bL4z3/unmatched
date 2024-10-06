import createClient from "openapi-fetch";
import { paths } from "./generated/api/v1";

export const openApiClient = createClient<paths>({
    baseUrl: "http://localhost:3000",
});
