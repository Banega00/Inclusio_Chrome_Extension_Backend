import { Request, Response, NextFunction } from "express";
import Schemes from "./validation-schemes";
import { ErrorStatusCode } from "../status-codes";
import CustomError from "../errors/CustomError";
import { ZodError } from "zod";

export async function validateRequestPayload(request: Request, response: Response, next: NextFunction) {
  try {
    const body = request.body;
    const path = request.url as keyof typeof Schemes;
    let schema = Schemes[request.method.toUpperCase()]?.[path];

    //if schema for specific route exists - use it to validate request payload
    //if does not exist - proceed
    if(schema) schema.parse(body)

    next();
  } catch (error) {
    if(error instanceof ZodError){
      //this error will be caught by errorWrapper which will forward error to error handler
      throw new CustomError({status: 400, code: ErrorStatusCode.VALIDATION_ERROR, message:'Invalid request body', payload: error?.errors})
    }else{
      throw error
    }
  }
}