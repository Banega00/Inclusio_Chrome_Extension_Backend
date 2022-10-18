import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PageStatus } from "../PageStatus.enum";
import { UserRole } from "../UserRole.enum";
import { PageRequestEntity } from "./PageRequest.entity";
import { UserEntity } from "./User.entity";

@Entity()
export class PageEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    page_url: string;

    @Column({nullable: false})
    page_title: string;

    @Column({type: 'jsonb', default: {}})
    images_alt_text:{
        [image_src: string]: string;
    }

    @Column({type: 'enum', enum: PageStatus, nullable: true, default: PageStatus.Not_Covered})
    status: PageStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => PageRequestEntity, (page_request) => page_request.page)
    @JoinTable()
    requests: PageRequestEntity[]

    constructor(obj?: Partial<PageEntity>) {
        if(!obj) return;

        if(obj.id) this.id = obj.id;
        if(obj.page_url) this.page_url = obj.page_url;
        if(obj.page_title) this.page_title = obj.page_title;
        if(obj.images_alt_text) this.images_alt_text = obj.images_alt_text;
        if(obj.requests) this.requests = obj.requests;
        
    }
}