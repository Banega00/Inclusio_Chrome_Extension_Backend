import { DeepPartial, EntityManager } from "typeorm";
import { dataSource } from "../../main";
import { PageRequestEntity } from "../models/entities/PageRequest.entity";
import { BaseRepository } from "./base.repository";

export class PageRequestRepository extends BaseRepository<PageRequestEntity>{

    constructor() {
        super();
    }

    async add(entity: PageRequestEntity, entityManager?: EntityManager | undefined): Promise<PageRequestEntity> {
        const manager = entityManager ?? dataSource.manager;PageRequestEntity
        await manager.save(entity);
        return entity;
    }
    async find(filter: any, entityManager?: EntityManager | undefined, options?: any): Promise<PageRequestEntity[]> {
        const manager = entityManager ?? dataSource.manager;
        return await manager.find(PageRequestEntity, {where: filter, ...options})
    }

    async findOne(filter: any, entityManager?: EntityManager | undefined, options?: any): Promise<PageRequestEntity | undefined>  {
        const manager = entityManager ?? dataSource.manager;
        const page = await manager.findOne(PageRequestEntity, {where: filter, ...options})
        if(page == undefined) return undefined;
        return page;
    }

    async update(filter: any, deepPartial: DeepPartial<PageRequestEntity>, entityManager?: EntityManager | undefined): Promise<any> {
        const manager = entityManager ?? dataSource.manager;
        await manager.update(PageRequestEntity, filter, deepPartial);
    }
    
    async delete(entity: PageRequestEntity, entityManager?: EntityManager | undefined): Promise<PageRequestEntity> {
        throw new Error("Method not implemented.");
    }

    async save(entity: PageRequestEntity, entityManager?: EntityManager | undefined): Promise<PageRequestEntity> {
        const manager = entityManager ?? dataSource.manager;
        await manager.save(entity);
        return entity;
    }


}