import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PageStatus } from "../PageStatus.enum";
import { UserRole } from "../UserRole.enum";

@Entity()
export class PageEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    page_url: string;

    @Column({type: 'jsonb', default: {}})
    images_alt_text:{
        [image_src: string]: string;
    }

    @Column({type: 'enum', enum: PageStatus, nullable: true})
    status: PageStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor(obj?: Partial<PageEntity>) {
        if(!obj) return;

        if(obj.id) this.id = obj.id;
        if(obj.page_url) this.page_url = obj.page_url;
        if(obj.images_alt_text) this.images_alt_text = obj.images_alt_text;
        
    }
}