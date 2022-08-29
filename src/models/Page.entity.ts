import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}