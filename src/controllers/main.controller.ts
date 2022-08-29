import { Request, Response } from "express";
import * as DTO from '../models/dto'
import { MainService } from "../services/main.service";
import { SuccessStatusCode } from "../status-codes";
import { sendResponse } from "../utils/response-wrapper";


export class MainController{
    
    private mainService:MainService;


    constructor() {
        this.mainService = new MainService();
    }

    insertOrUpdatePage = async (request: Request, response: Response) =>{
        const data: DTO.Request.InsertOrUpdatePage = request.body;

        await this.mainService.insertOrUpdatePage(data.pageUrl, data.altText)

        sendResponse({response, code: SuccessStatusCode.Success, status: 200})
    }
}