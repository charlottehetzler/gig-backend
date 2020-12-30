import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Category } from "./category";
import { Producer } from "../user/producer";

@ObjectType()
@Entity() export class Job extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    name: string;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => Category, category => category.jobs)
    @JoinColumn({ name: 'categoryId' })
    @Field(type => Category)
    category: Category;

    @ManyToOne(type => Producer, producer => producer.jobs)
    @JoinColumn({ name: 'producerId' })
    @Field(type => Producer)
    producer: Producer;
}