import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/CustomError";
import { UserService } from "../services/user.service";
import { ErrorStatusCode, SuccessStatusCode } from "../status-codes";
import Logger from "../utils/Logger";
import { sendResponse } from "../utils/response-wrapper";
import * as DTO from '../models/dto'
import jsonwebtoken from 'jsonwebtoken'
import { env } from "../utils/env-wrapper";
export class UserController {
    private logger: Logger;
    private userService: UserService;

    constructor() {
        this.logger = new Logger(this.constructor.name)
        this.userService = new UserService();

    }

    registerUser = async (request: Request, response: Response, next: NextFunction) => {
        const data: DTO.Request.RegisterUser = request.body;

        this.logger.debug("Registering user")

        const user = await this.userService.registerUser(data.username, data.password, data.email, data.role)

        const jwt = jsonwebtoken.sign({ id: user.id, username: user.username, role: user.role }, env.jwt_secret);

        sendResponse({response, status:201, code: SuccessStatusCode.Success, message: `User successfully registered`, payload: {token: jwt}})
    }

    loginUser = async (request: Request, response: Response, next: NextFunction) => {
        const data: DTO.Request.LoginUser = request.body;

        const user = await this.userService.loginUser(data.username, data.password)

        const jwt = jsonwebtoken.sign({ id: user.id, username: user.username, role: user.role }, env.jwt_secret);

        response.cookie('token',jwt,{ maxAge: 1000 * 60 * 60 * 24, httpOnly: false });

        sendResponse({status:200, code: SuccessStatusCode.Success, response, payload: {token: jwt}})
    }

    //If you wrapped middleware function with error wrapper - there is no need to use try/catch at top level
    //every throw error will be delegate to error handle by error wrapper
    exampleMiddleware = async (request: Request, response: Response, next: NextFunction) => {
        //!Don't use any - always look to specify exact type of payload which you expect to get here  
        const data: DTO.Request.ExampleMiddleware = request.body;

        //this error goes to errorWrapper -> errorHandler
        throw new CustomError({code:ErrorStatusCode.UNKNOWN_ERROR, message:'Test error!'})

        const serviceResponse = this.userService.exampleMethod(data);

        sendResponse({ response, status: 200, code: SuccessStatusCode.Success });

    }

    testHttpMiddleware = async (request: Request, response: Response, next: NextFunction) => {
        const data: any = request.body;

        const serviceResponse = await this.userService.testHttpMiddleware(data);

        sendResponse({ response, status: 200, code: SuccessStatusCode.Success, payload: serviceResponse });
    }
}