import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Category } from "./category";
import { SkillUserRelation } from "./skillUserRelation";
import { Review } from "./review";

@ObjectType()
@Entity() export class Skill extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    name: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    description: string;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => Category, category => category.skills)
    @JoinColumn({ name: 'categoryId' })
    @Field(type => Category)
    category: Category;

    @Field(type => [SkillUserRelation], {nullable: true })
    @OneToMany(type => SkillUserRelation, skillUserRelation => skillUserRelation.skill, { nullable: true })
    skillUserRelation: SkillUserRelation[];

    @Field(type => [Review], { nullable: true })
    @OneToMany(type => Review, review => review.skill, {cascade: true})
    reviews: Review[];
}

