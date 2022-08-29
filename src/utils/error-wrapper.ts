import { Request, Response, NextFunction, RequestHandler } from "express";

export const errorWrapper = (expressMiddleware: RequestHandler) => {
  return async (request: Request, response: Response, next:NextFunction) => {
    try {
      await expressMiddleware(request, response, next);
    } catch (error) {
      next(error)
    }
  }
}