import { ErrorStatusCode } from "../status-codes";

export default class CustomError extends Error{
    status: number;
    code: ErrorStatusCode;
    payload: any;

    constructor(obj:Partial<CustomError>) {
        super(obj.message);
        
        this.payload = obj.payload;
        this.status = obj.status ?? 400;
        this.code = obj.code ?? ErrorStatusCode.UNKNOWN_ERROR;
    }
}