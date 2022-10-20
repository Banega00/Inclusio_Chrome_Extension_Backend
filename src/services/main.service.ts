import { LessThan, MoreThan, Not } from "typeorm";
import CustomError from "../errors/CustomError";
import { PageEntity } from "../models/entities/Page.entity";
import { PageRequestEntity } from "../models/entities/PageRequest.entity";
import { UserEntity } from "../models/entities/User.entity";
import { PageStatus } from "../models/PageStatus.enum";
import { PageRequestRepository } from "../repository/page-request.repository";
import { PageRepository } from "../repository/page.repository";
import { UserRepository } from "../repository/user.repository";
import { ErrorStatusCode } from "../status-codes";
import { env } from "../utils/env-wrapper";
import Logger from "../utils/Logger";
import { MailingService } from "./mailing.service";

export class MainService{
    
    private pageRepository: PageRepository;
    private userRepository: UserRepository;
    private pageRequestRepository: PageRequestRepository;
    private mailingService: MailingService;
    private logger: Logger;
    constructor() {
        this.pageRepository = new PageRepository();
        this.userRepository = new UserRepository();
        this.pageRequestRepository = new PageRequestRepository();
        this.logger = new Logger(this.constructor.name);
        this.mailingService = new MailingService();
    }

    insertOrUpdatePage = async (pageUrl: string, altText: {[img_src: string]: string})=>{
        const page = await this.pageRepository.findOne({page_url: pageUrl})

        if(!page){
            return await this.pageRepository.add(new PageEntity({page_url: pageUrl, images_alt_text: altText}))
        }else{
            for(const img_src in altText){
                page.images_alt_text[img_src] = altText[img_src]
            }
            page.updated_at = new Date();
            return await this.pageRepository.save(page)
        }
    }

    getPage = async (pageUrl: string, username?: string)=>{
        const page = await this.pageRepository.findOne({page_url: pageUrl}, undefined, username ? {relations: ['requests', 'requests.user']} : {});

        
        if(!page) throw new CustomError({code: ErrorStatusCode.PAGE_NOT_FOUND, status: 404, message: 'Page not found', payload: { pageUrl }})
        
        let requested = false
        // this.logger.debug("Page", page)
        if(page?.requests && username){
            requested = page.requests.some(request => request.user.username == username);
        }

        page.requests = [];

        return { page, requested };
    }

    requestPage = async (pageUrl: string, pageTitle: string, id: number)=>{
        let [user, page] = await Promise.all([
            await this.userRepository.findOne({id}, undefined, {relations: ['requests']}),
            await this.pageRepository.findOne({page_url: pageUrl}, undefined, {relations: ['requests','requests.publisher']})
        ])
        
        if(!user) throw new CustomError({code: ErrorStatusCode.USER_NOT_FOUND, status: 404, message: `User ${id} not found`})
        
    
        if(!page){
            page = new PageEntity({page_url: pageUrl, page_title: pageTitle, images_alt_text: {}, requests:[], status: PageStatus.Not_Covered})
        }else{
            //send email to volunteer that processed this page (latest one)
            if(page.requests && page.requests.length > 0){
                const sortedRequestById = page.requests.sort((a, b) => b.id - a.id);
                let lastRequestWithPublisher = sortedRequestById.find(request => request.fulfilled);

                if (lastRequestWithPublisher) {
                    const { publisher } = lastRequestWithPublisher;

                    //Sending mail
                    try {
                        this.logger.debug(`Sending email to notify volunteer that consumer requested improvements for page that he've processed`)

                    if (publisher.preferences?.receiveMail?.onPageRequest) {
                            await this.mailingService.improvementsRequested(user, pageUrl, publisher);
                        }
                    } catch (error) {
                        this.logger.error('Error sending email', error)
                    }
                }
            }
        }
        
        if(page.status == PageStatus.Covered) page.status = PageStatus.Not_Covered;

        this.logger.debug(`Page status: ${page.status}`);

        const pageRequest = new PageRequestEntity({user, page})

        await Promise.all([
            await this.userRepository.save(user),
            await this.pageRepository.save(page),
            await this.pageRequestRepository.save(pageRequest)
        ])

        //Sending mail
        try{
            this.logger.debug(`Sending email to confirm consumer that page is requested for processing`)

            if(user.preferences?.receiveMail?.onPageRequest){
                await this.mailingService.consumerRequestedPage(user, pageUrl);
            }
        }catch(error){
            this.logger.error('Error sending email', error)
        }

        this.logger.debug(`After saving: ${page.status}`)
    }

    fiveMinsEarlier = () => {
        const fiveMins = new Date(Date.now() - 5*60*1000)
        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let localISOTime = (new Date(fiveMins.getTime() - tzoffset)).toISOString()
        return localISOTime;
    }


    getRequestedPages = async ()=>{
        const query = [
            { updated_at: LessThan(this.fiveMinsEarlier()), status: Not(PageStatus.Covered)},
            { created_at: MoreThan(this.fiveMinsEarlier()), status: Not(PageStatus.Covered)},
            { requests: { fulfilled: false } }
        ]


        const pages = await this.pageRepository.find(query, undefined, {relations: ['requests']})

        const requestedPages:{page: PageEntity, requests: number}[] = [];
        pages.forEach(page=>{
            if(page.requests && page.requests.length > 0){
                const pageRequests = page.requests.length;
                page.requests = []
                requestedPages.push({page, requests: pageRequests})
            }
        })

        requestedPages.sort((a, b)=>{
            return b.requests - a.requests
        })

        return requestedPages;
    }

    publishPage = async (pageUrl: string, publisherId: number) =>{
        const page = await this.pageRepository.findOne({page_url: pageUrl}, undefined, {relations:['requests','requests.user']});

        this.logger.debug(`Page found: ${page!=undefined}`)

        if(!page) throw new CustomError({status:404, code: ErrorStatusCode.PAGE_NOT_FOUND, message:'Page not found'});

        for(const request of page.requests){
            //check if consumer should be notified
            if(!request.fulfilled && (request.user?.preferences?.receiveMail as any)?.onRequestedPagePublished){
                await this.mailingService.notifyConsumerAboutPublish(request.user, pageUrl);
            }

            request.fulfilled = true;
            request.publisher = new UserEntity({id: publisherId})
            await this.pageRequestRepository.save(request)
        }
        await this.pageRepository.update({page_url: pageUrl}, {status: PageStatus.Covered })
    }

    reportVolunteer = async(username: string, pageUrl: string, reasons: string[] | undefined) => {
        const page = await this.pageRepository.findOne({page_url: pageUrl}, undefined, {relations: ['requests','requests.publisher']})

        if(!page) throw new CustomError({ code: ErrorStatusCode.PAGE_NOT_FOUND, status: 404, message: 'Page not found'})
    
        if(page.requests && page.requests.length > 0){
            const sortedRequestById = page.requests.sort((a, b) => b.id - a.id);
            let lastRequestWithPublisher = sortedRequestById.find(request => request.fulfilled);

            if(lastRequestWithPublisher){
                //send mail to admin
                const adminMail = env.admin_mail;

                this.mailingService.reportVolunteerMail({
                    adminMail,
                    volunteerName: lastRequestWithPublisher.publisher.username,
                    consumerName: username,
                    pageUrl,
                    reasons: reasons
                })
            }
        }
    }
}