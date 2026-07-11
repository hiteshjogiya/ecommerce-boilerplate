export class AppError extends Error {
  constructor(message: string, public readonly statusCode = 500) {
    super(message);
    this.name = "AppError";
  }
}

export function toAppError(error: unknown, fallbackMessage = "Something went wrong") {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message || fallbackMessage);
  }

  return new AppError(fallbackMessage);
}
