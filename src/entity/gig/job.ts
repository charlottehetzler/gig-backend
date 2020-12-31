import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Category } from "./category";
import { Producer } from "../user/producer";
import { Gig } from "./gig";
import { JobProducerRelation } from "./jobProducerRelation";

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

    @OneToMany(type => Gig, gig => gig.job, {cascade: true})
    @Field(type => [Gig], { nullable: true })
    gigs: Gig[];

    @Field(type => [JobProducerRelation], {nullable: true })
    @OneToMany(type => JobProducerRelation, jobProducerRelation => jobProducerRelation.job, { nullable: true })
    jobProducerRelation: JobProducerRelation[];
}

