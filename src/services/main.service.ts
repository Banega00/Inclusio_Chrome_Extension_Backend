import CustomError from "../errors/CustomError";
import { PageEntity } from "../models/Page.entity";
import { PageRepository } from "../repository/page.repository";
import { ErrorStatusCode } from "../status-codes";

export class MainService{

    private pageRepository: PageRepository;

    constructor() {
        this.pageRepository = new PageRepository();
    }

    insertOrUpdatePage = async (pageUrl: string, altText: {[img_src: string]: string})=>{
        const page = await this.pageRepository.findOne({page_url: pageUrl})

        if(!page){
            return await this.pageRepository.add(new PageEntity({page_url: pageUrl, images_alt_text: altText}))
        }else{
            for(const img_src in altText){
                page.images_alt_text[img_src] = altText[img_src]
            }
            return await this.pageRepository.save(page)
        }
    }

    getPage = async (pageUrl: string)=>{
        const page = await this.pageRepository.findOne({page_url: pageUrl})

        if(!page) throw new CustomError({code: ErrorStatusCode.PAGE_NOT_FOUND, status: 404, message: 'Page not found', payload: { pageUrl }})

        return page;
    }
}