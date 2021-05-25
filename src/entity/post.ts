import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { GigUser } from "./gigUser";
import { Category } from "./category";
import { Skill } from "./skill";

@ObjectType()
@Entity() export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    title: string;

    @Column({ nullable: false })
    @Field({ nullable: false })
    description: string;

    @Column({ nullable: false })
    @Field({ nullable: false })
    fromDate: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    toDate: Date;

    @Column({ nullable: true, default: false })
    @Field({ nullable: true })
    isClosed: boolean;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => Category, category => category.posts)
    @JoinColumn({ name: 'categoryId' })
    @Field(type => Category)
    category: Category;

    @ManyToOne(type => Skill, skill => skill.posts)
    @JoinColumn({ name: 'skillId' })
    @Field(type => Skill)
    skill: Skill;

    @ManyToOne(type => GigUser, user => user.posts)
    @JoinColumn({ name: 'userId' })
    @Field(type => GigUser)
    user: GigUser;
}