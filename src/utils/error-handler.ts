import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError";
import { ErrorStatusCode } from "../status-codes";
import { env } from "./env-wrapper";
import Logger from "./Logger";
import { sendResponse } from "./response-wrapper";

const logger = new Logger('Error');
export const errorHandler = (error: Error, request: Request, response: Response, nextFunction: NextFunction) => {
    logger.error('Error', error);
    
    if(error instanceof CustomError){
        logger.error(error.message, {...error})
        return sendResponse({response, status: error.status, code: error.code, message: error.message, payload: error.payload});
    }

    logger.error(error.message, error);

    //send info about error stack in response if environment is development
    const errorPayload = env.env_type == "development" ? error.stack : undefined;

    return sendResponse({response, status: 500, code: ErrorStatusCode.UNKNOWN_ERROR, payload: errorPayload});
}