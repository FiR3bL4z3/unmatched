import type { Config } from "commitment";

const config: Config = {
    projectTag: "UNM",
    subProjectTags: [
        { name: "Client (app)", value: "WEB" },
        { name: "Api (app)", value: "API" },
        { name: "Commitment (package)", value: "CMT" },
        { name: "Schema-gen (package)", value: "SG" },
    ],
    types: {
        extend: [{ name: "Chore", value: "chore" }],
    },
};

export default config;
