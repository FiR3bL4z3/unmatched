import { TaggedError } from "./tagged-error";

export class NotFoundError extends TaggedError {
    readonly tag = "NOT_FOUND";

    constructor(message: string) {
        super(message);
    }
}
