// example config
import { Config } from "commitment";

const config: Config = {
    projectTag: "UNM",
    subProjectTags: [
        { name: "Client (app)", value: "WEB" },
        { name: "Api (app)", value: "API" },
        { name: "Commitment (package)", value: "CMT" },
    ],
    types: {
        extend: [{ name: "Chore", value: "chore" }],
    },
};

export default config;
