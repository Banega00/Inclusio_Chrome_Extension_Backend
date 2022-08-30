import { EntityManager } from "typeorm";
import { dataSource } from "../../main";
import { PageEntity } from "../models/entities/Page.entity";
import { BaseRepository } from "./base.repository";

export class PageRepository extends BaseRepository<PageEntity>{

    constructor() {
        super();
    }

    async add(entity: PageEntity, entityManager?: EntityManager | undefined): Promise<PageEntity> {
        const manager = entityManager ?? dataSource.manager;
        await manager.save(entity);
        return entity;
    }
    async find(filter: any, entityManager?: EntityManager | undefined, options?: any): Promise<PageEntity[]> {
        const manager = entityManager ?? dataSource.manager;
        return await manager.find(PageEntity, {where: filter, ...options})
    }

    async findOne(filter: any, entityManager?: EntityManager | undefined, options?: any): Promise<PageEntity | undefined>  {
        const manager = entityManager ?? dataSource.manager;
        const page = await manager.findOne(PageEntity, {where: filter, ...options})
        if(page == undefined) return undefined;
        return page;
    }

    async update(entity: PageEntity, entityManager?: EntityManager | undefined): Promise<PageEntity> {
        throw new Error("Method not implemented.");
    }
    async delete(entity: PageEntity, entityManager?: EntityManager | undefined): Promise<PageEntity> {
        throw new Error("Method not implemented.");
    }

    async save(entity: PageEntity, entityManager?: EntityManager | undefined): Promise<PageEntity> {
        const manager = entityManager ?? dataSource.manager;
        await manager.save(entity);
        return entity;
    }
}