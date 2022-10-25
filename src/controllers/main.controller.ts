import { Request, Response } from "express";
import CustomError from "../errors/CustomError";
import * as DTO from '../models/dto'
import { UserRole } from "../models/UserRole.enum";
import { MailingService } from "../services/mailing.service";
import { MainService } from "../services/main.service";
import { ErrorStatusCode, SuccessStatusCode } from "../status-codes";
import Logger from "../utils/Logger";
import { sendResponse } from "../utils/response-wrapper";


export class MainController{
    
    private mainService: MainService;
    private logger: Logger;

    constructor() {
        this.mainService = new MainService();
        this.logger = new Logger(this.constructor.name)
    }

    insertOrUpdatePage = async (request: Request, response: Response) =>{
        const data: DTO.Request.InsertOrUpdatePage = request.body;
        const user = response.locals.user;

        if(!user || user.role != UserRole.Volunteer) throw new CustomError({status: 401, code: ErrorStatusCode.UNAUTHORIZED})

        await this.mainService.insertOrUpdatePage(user.id, data.pageUrl, data.altText, data.addedAltTexts)

        sendResponse({response, code: SuccessStatusCode.Success, status: 200})
    }

    getPage = async (request: Request, response: Response) =>{
        const data: DTO.Request.GetPage = request.body;

        this.logger.debug(`Getting page ${data.pageUrl}`)
        const {page, requested} = await this.mainService.getPage(data.pageUrl, data.username);

        if(page) this.logger.debug(`Page found - id: ${page.id}`)

        sendResponse({response, code: SuccessStatusCode.Success, status: 200, payload: {page, requested}})
    }

    requestPageForProcessing = async (request: Request, response: Response) =>{
        const data: DTO.Request.RequestPage = request.body;

        const user = response.locals.user;

        if(!user || user.role != UserRole.Consumer) throw new CustomError({status: 401, code: ErrorStatusCode.INVALID_JWT})

        await this.mainService.requestPage(data.pageUrl, data.pageTitle , user.id);

        sendResponse({response, code: SuccessStatusCode.Success, status: 200})
    }

    getRequestedPages = async (request: Request, response: Response) =>{

        if(!response.locals.user || response.locals.user.role != 'Volunteer' ) throw new CustomError({message:"Forbidden", code: ErrorStatusCode.UNAUTHORIZED, status: 401})

        const pages = await this.mainService.getRequestedPages();

        sendResponse({response, status:200, code: SuccessStatusCode.Success, payload: pages})
    }

    publishPage = async (request: Request, response: Response) =>{

        const data: DTO.Request.PublishPage = request.body;

        if(!response.locals.user || response.locals.user.role != 'Volunteer' ) throw new CustomError({message:"Forbidden", code: ErrorStatusCode.UNAUTHORIZED, status: 401})

        await this.mainService.publishPage(data.pageUrl, response.locals.user.id);

        sendResponse({response, status:200, code: SuccessStatusCode.Success})
    }

    reportPage = async (request: Request, response: Response) => {
        const data: DTO.Request.ReportVolunteer = request.body;

        if(!response.locals.user || response.locals.user.role != 'Consumer' ) throw new CustomError({message:"Forbidden", code: ErrorStatusCode.UNAUTHORIZED, status: 401})
    
        await this.mainService.reportVolunteer(response.locals.user.username, data.pageUrl, data.reasons)

        sendResponse({response, status:200, code: SuccessStatusCode.Success})
    }
}