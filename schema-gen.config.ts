import type { Config } from "@unmatched/schema-gen";

const config: Config = {
    startScript: "bun client:dev",
    healthCheckUrl: "http://localhost:3000/health-check",
    generateScript: "bun client:gen",
};

export default config;