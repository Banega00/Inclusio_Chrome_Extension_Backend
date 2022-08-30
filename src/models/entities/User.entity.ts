import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../UserRole.enum";
import { PageEntity } from "./Page.entity";

@Entity()
export class UserEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    username: string;

    @Column({nullable: false})
    password: string

    @Column({nullable: true, type: 'enum', enum: UserRole})
    role: UserRole

    @ManyToMany(() => PageEntity)
    @JoinTable()
    requests: PageEntity[]

    constructor(obj?: Partial<UserEntity>) {
        if(!obj) return;
        
        obj.id && (this.id = obj.id)
        obj.username && (this.username = obj.username)
        obj.password && (this.password = obj.password)
        obj.role && (this.role = obj.role)
    }
}