import { Request, Response } from "express";
import CustomError from "../errors/CustomError";
import * as DTO from '../models/dto'
import { UserRole } from "../models/UserRole.enum";
import { MainService } from "../services/main.service";
import { ErrorStatusCode, SuccessStatusCode } from "../status-codes";
import { sendResponse } from "../utils/response-wrapper";


export class MainController{
    
    private mainService:MainService;


    constructor() {
        this.mainService = new MainService();
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

        const page = await this.mainService.getPage(data.pageUrl);

        sendResponse({response, code: SuccessStatusCode.Success, status: 200, payload: page})
    }
}