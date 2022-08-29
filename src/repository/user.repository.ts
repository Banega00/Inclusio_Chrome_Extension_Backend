import { EntityManager } from "typeorm";
import { dataSource } from "../../main";
import { UserEntity } from "../models/entities/User.entity";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<UserEntity>{
    

    constructor() {
        super();
        
    }

    async add(entity: UserEntity, entityManager?: EntityManager | undefined): Promise<UserEntity> {
        const manager = entityManager ?? dataSource.manager;
        await manager.save(entity);
        return entity;
    }
    async find(filter: any, entityManager?: EntityManager | undefined): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    async findOne(filter: any, entityManager?: EntityManager | undefined): Promise<UserEntity | undefined>  {
        const manager = entityManager ?? dataSource.manager;
        const user = await manager.findOne(UserEntity, {where: filter})
        if(user == undefined) return undefined;
        return user;
    }

    async update(entity: UserEntity, entityManager?: EntityManager | undefined): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }
    async delete(entity: UserEntity, entityManager?: EntityManager | undefined): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    
    
}