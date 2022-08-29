import { EntityManager } from "typeorm";
import { BusinessKey } from "../models/Business-key.entity";
import { BaseRepository } from "./base.repository";

export class BusinessKeyRepository extends BaseRepository<BusinessKey>{
    

    constructor() {
        super();
        
    }

    async add(entity: BusinessKey, entityManager?: EntityManager | undefined): Promise<BusinessKey> {
        throw new Error("Method not implemented.");
    }
    async find(filter: any, entityManager?: EntityManager | undefined): Promise<BusinessKey> {
        throw new Error("Method not implemented.");
    }

    async findOne(filter: any, entityManager?: EntityManager | undefined): Promise<BusinessKey>  {
        throw new Error("Method not implemented.");
    }

    async update(entity: BusinessKey, entityManager?: EntityManager | undefined): Promise<BusinessKey> {
        throw new Error("Method not implemented.");
    }
    async delete(entity: BusinessKey, entityManager?: EntityManager | undefined): Promise<BusinessKey> {
        throw new Error("Method not implemented.");
    }

    
    
}