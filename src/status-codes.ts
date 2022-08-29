export enum ErrorStatusCode {
    UNKNOWN_ERROR = 10000,
    VALIDATION_ERROR = 10001,
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
}

const SuccessStatusCodeDescription: { [key: number]: string } = {
    20000: "Operation successfully executed"
}
