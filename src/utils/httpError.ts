export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

// Generic errors
export const httpError = (status: number, message: string) =>
  new HttpError(status, message);

// 4xx - Client errors
export const badRequest = (message = "Bad Request") =>
  new HttpError(400, message);
export const unauthorized = (message = "Unauthorized") =>
  new HttpError(401, message);
export const paymentRequired = (message = "Payment Required") =>
  new HttpError(402, message);
export const forbidden = (message = "Forbidden") => new HttpError(403, message);
export const notFound = (message = "Not Found") => new HttpError(404, message);
export const methodNotAllowed = (message = "Method Not Allowed") =>
  new HttpError(405, message);
export const conflict = (message = "Conflict") => new HttpError(409, message);
export const gone = (message = "Gone") => new HttpError(410, message);
export const unprocessableEntity = (message = "Unprocessable Entity") =>
  new HttpError(422, message);
export const tooManyRequests = (message = "Too Many Requests") =>
  new HttpError(429, message);

// 5xx - Server errors
export const internalServerError = (message = "Internal Server Error") =>
  new HttpError(500, message);
export const notImplemented = (message = "Not Implemented") =>
  new HttpError(501, message);
export const badGateway = (message = "Bad Gateway") =>
  new HttpError(502, message);
export const serviceUnavailable = (message = "Service Unavailable") =>
  new HttpError(503, message);
export const gatewayTimeout = (message = "Gateway Timeout") =>
  new HttpError(504, message);
