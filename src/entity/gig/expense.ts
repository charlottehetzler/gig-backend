import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Gig } from "./gig";

@ObjectType()
@Entity() export class Expense extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    title: string;

    @Column({ nullable: false })
    @Field({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    attachment: string;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => Gig, gig => gig.expenses)
    @JoinColumn({ name: 'gigId' })
    @Field(type => Gig)
    gig: Gig;
}