import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PageStatus } from "../PageStatus.enum";
import { UserRole } from "../UserRole.enum";
import { PageEntity } from "./Page.entity";
import { UserEntity } from "./User.entity";

@Entity()
export class PageRequestEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.requests)
    user: UserEntity;

    @ManyToOne(() => PageEntity, (page) => page.requests)
    page: PageEntity;

    @ManyToOne(() => UserEntity, {nullable:  true})
    publisher: UserEntity;

    @Column({nullable: true})
    publisherId: number;

    @Column({default: false})
    fulfilled: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor(obj?: Partial<PageRequestEntity>) {
        if(!obj) return;

        if(obj.id) this.id = obj.id;
        if(obj.user) this.user = obj.user;
        if(obj.page) this.page = obj.page;
        if(obj.fulfilled) this.fulfilled = obj.fulfilled;
        
    }
}