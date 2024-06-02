export abstract class TaggedError extends Error {
  abstract readonly tag: string;
  constructor(
    message?: string | undefined,
    options?: ErrorOptions | undefined
  ) {
    super(message, options);
  }
}
