import { Request, Response } from "express";
import CustomError from "../errors/CustomError";
import * as DTO from '../models/dto'
import { UserRole } from "../models/UserRole.enum";
import { MainService } from "../services/main.service";
import { ErrorStatusCode, SuccessStatusCode } from "../status-codes";
import Logger from "../utils/Logger";
import { sendResponse } from "../utils/response-wrapper";


export class MainController{
    
    private mainService:MainService;
    private logger: Logger;

    constructor() {
        this.mainService = new MainService();
        this.logger = new Logger('MainController')
    }

    insertOrUpdatePage = async (request: Request, response: Response) =>{
        const data: DTO.Request.InsertOrUpdatePage = request.body;
        const user = response.locals.user;

        if(!user || user.role != UserRole.Volunteer) throw new CustomError({status: 401, code: ErrorStatusCode.UNAUTHORIZED})

        await this.mainService.insertOrUpdatePage(data.pageUrl, data.altText)

        sendResponse({response, code: SuccessStatusCode.Success, status: 200})
    }

    getPage = async (request: Request, response: Response) =>{
        const data: DTO.Request.GetPage = request.body;

        this.logger.debug('Getting page...',{pageUrl: data.pageUrl})
        const page = await this.mainService.getPage(data.pageUrl);

        sendResponse({response, code: SuccessStatusCode.Success, status: 200, payload: page})
    }
}