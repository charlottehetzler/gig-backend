import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { GigUser } from "./gigUser";
import { LanguageUserRelation } from "./languageUserRelation";

@ObjectType()
@Entity() export class Language extends BaseEntity {

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

    @Field(type => [LanguageUserRelation], {nullable: true })
    @OneToMany(type => LanguageUserRelation, languageUserRelation => languageUserRelation.language, { nullable: true })
    languageUserRelation: LanguageUserRelation[];
}