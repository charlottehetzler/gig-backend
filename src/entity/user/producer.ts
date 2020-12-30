import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { GigUser } from "./gigUser";
import { Gig } from "../gig/gig";
import { Job } from "../gig/job";

@ObjectType()
@Entity() export class Producer extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @OneToOne(() => GigUser)
    @JoinColumn()
    user: GigUser; 

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    // @Column({ nullable: true })
    // @Field({ nullable: true })
    // attachments: string;

    @OneToMany(type => Gig, gig => gig.producer, {cascade: true})
    @Field(type => [Gig], { nullable: true })
    gigs: Gig[];

    @OneToMany(type => Job, job => job.producer, {cascade: true})
    @Field(type => [Job], { nullable: true })
    jobs: Job[];
}