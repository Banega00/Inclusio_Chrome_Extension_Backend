import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import { validateRequestPayload } from './utils/validator';
import cors from 'cors';
import { errorHandler } from './utils/error-handler';
import httpContext from 'express-http-context'
import { randomString } from './utils/helpers';
import Logger from './utils/Logger';
import { router } from "./routes/router";
import path from 'path'
import { errorWrapper } from "./utils/error-wrapper";
import { sendResponse } from "./utils/response-wrapper";
import { ErrorStatusCode, SuccessStatusCode } from "./status-codes";
import CustomError from "./errors/CustomError";

const logger = new Logger('App');

const app: express.Application = express();

app.use(cors());
app.use(json({ limit: "50mb", type: "application/json" }));

app.use(httpContext.middleware);
app.use(errorWrapper((request: Request, response: Response, next: NextFunction) => {
    const reqId = request.headers.reqid ?? randomString(6)
    httpContext.set('ip', request.ip)
    httpContext.set('reqId', reqId);
    httpContext.set('startTime', Date.now());
    httpContext.set('route', `${request.method.toUpperCase()} ${request.originalUrl}`);
    next();
}))

//Logger for logging express route
app.use(errorWrapper((request: Request, response: Response, next: NextFunction) => {
    logger.info(`Start of Request: ${httpContext.get('route')}`)
    next();
}))

app.use(errorWrapper(validateRequestPayload));


// app.use('/test-error-wrapper', errorWrapper(async function (request, response, next) {
//     // throw new CustomError({message:'Test Error Wrapper Message', code: ErrorStatusCode.UNKNOWN_ERROR})
//     sendResponse({response, status:200, code:SuccessStatusCode.Success})
// }))

app.use(router)

app.use(express.static(path.join(__dirname, './public')))

app.use(errorHandler);


export default app;
