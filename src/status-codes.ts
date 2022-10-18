export enum ErrorStatusCode {
    UNKNOWN_ERROR = 10000,
    VALIDATION_ERROR = 10001,
    USER_ALREADY_EXISTS = 10002,
    USER_NOT_FOUND = 10003,
    INVALID_PASSWORD = 10004,
    MISSING_JWT = 10005,
    INVALID_JWT = 10006,
    UNAUTHORIZED = 10007,
    PAGE_NOT_FOUND = 10008,
    ERROR_SENDING_MAIL = 10009,
}

export enum SuccessStatusCode {
    Success = 20000
}

export function getStatusCodeDescription(status: SuccessStatusCode | ErrorStatusCode): string {
    return status in SuccessStatusCode ? SuccessStatusCodeDescription[status] : ErrorStatusCodeDescription[status];
}

const ErrorStatusCodeDescription: { [key: number]: string } = {
    10000: "Unknown error, please try again.",
    10001: "Invalid request payload",
    10002: "User already exists",
    10003: "User not found",
    10004: "Invalid password",
    10005: "Missing token",
    10006: "Invalid token",
    10007: "Unauthorized",
    10008: "Page not found",
    10009: "Error sending mail"
}

const SuccessStatusCodeDescription: { [key: number]: string } = {
    20000: "Operation successfully executed"
}
