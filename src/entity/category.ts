import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Skill } from "./skill";
import { Deal } from "./deal";
import { Post } from "./post";

@ObjectType()
@Entity() export class Category extends BaseEntity {

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

    @OneToMany(type => Skill, skill => skill.category, {cascade: true})
    @Field(type => [Skill], { nullable: true })
    skills: Skill[];

    @OneToMany(type => Post, post => post.category, {cascade: true})
    @Field(type => [Post], { nullable: true })
    posts: Post[];

    @OneToMany(type => Deal, deal => deal.category, {cascade: true})
    @Field(type => [Deal], { nullable: true })
    deals: Deal[];
}