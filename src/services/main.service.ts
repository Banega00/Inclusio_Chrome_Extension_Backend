import { PageRepository } from "../repository/page.repository";

export class MainService{

    private pageRepository: PageRepository;

    constructor() {
        this.pageRepository = new PageRepository();
    }

    insertOrUpdatePage = async (pageUrl: string, altText: {[img_src: string]: string})=>{
        
    }
}