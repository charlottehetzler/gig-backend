import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { GigUser } from "./gigUser";

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

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => GigUser, user => user.addresses)
    @JoinColumn({ name: 'userId' })
    @Field(type => GigUser)
    user: GigUser;
}