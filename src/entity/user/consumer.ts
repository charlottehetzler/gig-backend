import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { GigUser } from "./gigUser";
import { Gig } from "../gig/gig";
import { PaymentMethod } from "../payment/paymentMethod";

@ObjectType()
@Entity() export class Consumer extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @OneToOne(() => GigUser)
    @Field(type => GigUser)
    @JoinColumn()
    user: GigUser; 

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @OneToMany(type => Gig, gig => gig.consumer, {cascade: true})
    @Field(type => [Gig], { nullable: true })
    gigs: Gig[];

    @OneToMany(type => PaymentMethod, paymentMethod  => paymentMethod.consumer, {cascade: true})
    @Field(type => [PaymentMethod], { nullable: true })
    paymentMethods: PaymentMethod[];
}