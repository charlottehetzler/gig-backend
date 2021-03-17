import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Skill } from "./skill";

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
}