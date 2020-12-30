import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { GigUser } from "../user/gigUser";

export enum UserType {
    "consumer" = "consumer",
    "producer" = "producer"
}

@ObjectType()
@Entity() export class GigUserType extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field()
    type: UserType.consumer | UserType.producer;

    @OneToOne(() => GigUser)
    @JoinColumn()
    user: GigUser;   

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
}
