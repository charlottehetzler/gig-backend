import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { Address } from "./address";
import { PaymentMethod } from "../payment/paymentMethod";
import { Review } from "./review";

@ObjectType()
@Entity() export class GigUser extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    @Field({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    @Field({ nullable: false })
    email: string;

    @Column({ nullable: false })
    @Field({ nullable: false })
    birthday: Date;

	@Column({ nullable: true })
    @Field({ nullable: true })
    profilePicture: string;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @OneToMany(type => Address, address => address.user, {cascade: true})
    @Field(type => [Address], { nullable: true })
    addresses: Address[];

    @OneToMany(type => Review, review => review.user, {cascade: true})
    @Field(type => [Review], { nullable: true })
    reviews: Review[];
}