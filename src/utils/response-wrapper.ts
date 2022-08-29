import { Request, Response } from "express";
import { SuccessStatusCode, ErrorStatusCode, getStatusCodeDescription } from "../status-codes";
import Logger from "./Logger";
import httpContext from 'express-http-context'
const logger = new Logger('End of Request');

export function sendResponse(responseObject:{response: Response, status: number, code: SuccessStatusCode | ErrorStatusCode, message?: string, payload?: any}): void {
    const {response, status, code, message, payload} = responseObject; 
    
    const messageToSend = message || getStatusCodeDescription(code);

    logger.info(`${Date.now() - httpContext.get('startTime')}msec | ${httpContext.get('route')}`)

    response.status(status).json({status, code, message: messageToSend, payload})
}

export function sendInvalidMethodResponse(_: Request, response: Response): void {
    response.status(405).send();
}