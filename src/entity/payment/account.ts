import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Payment } from "./payment";
import { Consumer } from "../user/consumer";

@ObjectType()
@Entity() export class Account extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    accountName: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    balance: number;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @OneToMany(type => Payment, payment => payment.account, {cascade: true})
    @Field(type => [Payment], { nullable: true })
    payments: Payment[];

    @OneToOne(() => Consumer)
    @JoinColumn()
    consumer: Consumer; 
}