import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
    ManyToMany,
    JoinTable
} from "typeorm";
import { Expose } from 'class-transformer';
import { Length } from "class-validator";
import * as bcrypt from "bcrypt";
import { Role } from '../../role.enum';

@Entity()
@Unique(["username"])
export class User extends BaseEntity {
    
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column()
    @Length(4, 20)
    username: string;

    @Expose()
    @Column()
    @Length(4, 100)
    password: string;

    @Expose()
    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Expose()
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Expose()
    @Column()
    @UpdateDateColumn()
    lastLogin: Date;

    @Expose()
    @Column('simple-array', { nullable: true })
    roles: Role[];

    @Expose()
    @Column('text', { nullable: true })
    refreshtoken:string;

    @Expose()
    @Column('text', { nullable: true })
    refreshtokenexpires:string;

    @Expose()
    @Column('text', { nullable: true })
    ipAddress: string;

    @Expose()
    @Column('text', { nullable: true })
    userAgent: string;

    @Expose()
    @Column('text', { nullable: true })
    device: string;

    @Expose()
    @Column('text', { nullable: true })
    @Length(4, 200)
    token: string;

    @Expose()
    @Column('text', { nullable: true })
    @Length(4, 30)
    deviceid: string;

    
    constructor(data: Partial<User> = {}) {
        super();
        Object.assign(this, data);
    }

    @BeforeUpdate()
    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
        return this.password;
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}