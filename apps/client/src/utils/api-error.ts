export class APIError extends Error {
    constructor(
        public readonly info: {
            readonly path: string;
            readonly description: string;
            readonly ok: false;
        },
    ) {
        super(`API Error`);
    }
}
