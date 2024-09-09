import { TaggedError } from "./tagged-error";

export class PrismaError extends TaggedError {
    readonly tag = "PRISMA_ERROR";

    constructor(message: string) {
        super(message);
    }
}

export const handlePrismaError = (error: unknown) =>
    new PrismaError(`PrismaError: ${JSON.stringify(error)}`);
