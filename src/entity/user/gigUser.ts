import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { Address } from "./address";
import { PaymentMethod } from "../payment/paymentMethod";
import { Review } from "./review";
import { Producer } from "./producer";
import { Consumer } from "./consumer";

export enum UserType {
    "consumer" = "consumer",
    "producer" = "producer"
}


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

    @Column({ nullable: true })
    @Field({ nullable: true })
    type: UserType.consumer | UserType.producer;

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

    @OneToOne(() => Producer)
    @Field(type => Producer)
    @JoinColumn({ name: 'producerId' })
    producer: Producer;  
    
    @OneToOne(() => Consumer)
    @Field(type => Consumer)
    @JoinColumn({ name: 'consumerId' })
    consumer: Consumer;
}