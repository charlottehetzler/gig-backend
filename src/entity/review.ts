import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { GigUser } from "./gigUser";
import { Skill } from "./skill";

@ObjectType()
@Entity() export class Review extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    fromUserId: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    rating: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    comment: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    skillId: number;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => GigUser, user => user.reviews)
    @JoinColumn({ name: 'userId' })
    @Field(type => GigUser)
    user: GigUser;

    @ManyToOne(type => Skill, skill => skill.reviews)
    @JoinColumn({ name: 'skillId' })
    @Field(type => Skill)
    skill: Skill;
}