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
import { SuccessStatusCode } from "./status-codes";
import cookieParser from "cookie-parser";

const logger = new Logger('App');

const app: express.Application = express();

app.use(cors());
app.use(json({ limit: "50mb", type: "application/json" }));
app.use(cookieParser())


app.use(httpContext.middleware);
app.use(Logger.logExpressRoute)


//Logger for logging express route
app.use(Logger.logExpressRoute)

app.use('/health', (request, response) => sendResponse({response, status: 200, message: 'Server alive', code: SuccessStatusCode.Success}))

app.use(errorWrapper(validateRequestPayload));

// app.use('/test-error-wrapper', errorWrapper(async function (request, response, next) {
//     // throw new CustomError({message:'Test Error Wrapper Message', code: ErrorStatusCode.UNKNOWN_ERROR})
//     sendResponse({response, status:200, code:SuccessStatusCode.Success})
// }))

app.use(router)

app.use(express.static(path.join(__dirname, './public')))

app.use(errorHandler);


export default app;
