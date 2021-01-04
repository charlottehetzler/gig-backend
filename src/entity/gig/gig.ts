import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Job } from "./job";
import { Consumer } from "../user/consumer";
import { Producer } from "../user/producer";
import { Expense } from "./expense";
import { Address } from "../user/address";

@ObjectType()
@Entity() export class Gig extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    title: string;

    @Column({ type: 'decimal', scale: 2, nullable: false})
    @Field({ nullable: false })
    price: number;

    @Column({ nullable: false, default: '$' })
    @Field({ nullable: false })
    currency: string;

    @Column({ nullable: false, default: 'open' })
    @Field({ nullable: false })
    status: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    description: string;

    @Column({ nullable: true })
    @Field(type => GraphQLISODateTime)
    date: Date;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => Consumer, consumer => consumer.gigs)
    @JoinColumn({ name: 'consumerId' })
    @Field(type => Consumer)
    consumer: Consumer;

    @ManyToOne(type => Producer, producer => producer.gigs)
    @JoinColumn({ name: 'producerId' })
    @Field(type => Producer)
    producer: Producer;

    @OneToMany(type => Expense, expense => expense.gig, {cascade: true})
    @Field(type => [Expense], { nullable: true })
    expenses: Expense[];

    @ManyToOne(type => Job, job => job.gigs)
    @JoinColumn({ name: 'jobId' })
    @Field(type => Job)
    job: Job;

    @ManyToOne(type => Address, address => address.gigs)
    @JoinColumn({ name: 'addressId' })
    @Field(type => Address)
    address: Address;
 
}