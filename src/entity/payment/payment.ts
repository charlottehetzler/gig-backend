import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Column, ManyToOne } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Consumer } from "../user/consumer";
import { PaymentMethod } from "./paymentMethod";
import { Account } from "./account";
import { Gig } from "../gig/gig";

@ObjectType()
@Entity() export class Payment extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    dateOfPayment: Date;

    @Column({ nullable: false })
    @Field({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    purpose: string;

    @Column({ nullable: false })
    @Field({ nullable: false })
    status: string;
    
    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
    
    @OneToOne(() => Consumer)
    @Field(type => Consumer)
    @JoinColumn()
    consumer: Consumer; 

    @OneToOne(() => Gig)
    @Field(type => Gig)
    @JoinColumn()
    gig: Gig;

    @ManyToOne(type => Account, account => account.payments)
    @JoinColumn({ name: 'accountId' })
    @Field(type => Account)
    account: Account;

    @OneToOne(() => PaymentMethod)
    @Field(type => PaymentMethod)
    @JoinColumn()
    paymentMethod: PaymentMethod; 

}