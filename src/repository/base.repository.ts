import { DeepPartial, EntityManager } from "typeorm";

export abstract class BaseRepository<T>{

    constructor(){

    }

    //CRUD

    abstract add(entity: T, entityManager?: EntityManager): T | Promise<T>;
    abstract find(filter:any, entityManager?: EntityManager): T | Promise<T[]>;
    abstract findOne(filter:any, entityManager?: EntityManager, options?: any): T | Promise<T | undefined>;
    abstract update(filter: any, deepPartial:DeepPartial<T>, entityManager?: EntityManager): T | Promise<T>;
    abstract delete(entity: T, entityManager?: EntityManager): any;
}