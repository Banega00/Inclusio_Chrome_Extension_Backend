import CustomError from "../errors/CustomError";
import { PageEntity } from "../models/entities/Page.entity";
import { PageStatus } from "../models/PageStatus.enum";
import { PageRepository } from "../repository/page.repository";
import { UserRepository } from "../repository/user.repository";
import { ErrorStatusCode } from "../status-codes";

export class MainService{

    private pageRepository: PageRepository;
    private userRepository: UserRepository;

    constructor() {
        this.pageRepository = new PageRepository();
        this.userRepository = new UserRepository();
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

    getPage = async (pageUrl: string, username?: string)=>{
        const page = await this.pageRepository.findOne({page_url: pageUrl}, undefined, username ? {relations: ['requests']} : {});

        
        if(!page) throw new CustomError({code: ErrorStatusCode.PAGE_NOT_FOUND, status: 404, message: 'Page not found', payload: { pageUrl }})
        
        let requested = false
        if(page?.requests && username){
            requested = page.requests.some(request => request.username == username);
        }

        page.requests = [];

        return { page, requested };
    }

    requestPage = async (pageUrl: string, username: string)=>{
        let [user, page] = await Promise.all([
            await this.userRepository.findOne({username}, undefined, {relations: ['requests']}),
            await this.pageRepository.findOne({page_url: pageUrl}, undefined, {relations: ['requests']})
        ])
        
        if(!user) throw new CustomError({code: ErrorStatusCode.USER_NOT_FOUND, status: 404, message: `User ${username} not found`})
        
    
        if(!page){
            page = new PageEntity({page_url: pageUrl, images_alt_text: {}, requests:[], status: PageStatus.Not_Covered})
            page.requests.push(user);
        }

        user.requests.push(page);

        await Promise.all([
            await this.userRepository.save(user),
            await this.pageRepository.save(page)
        ])
    }

    
}