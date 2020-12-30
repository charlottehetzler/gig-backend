import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, Column, ManyToOne } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { PaymentType } from "../types/payment";
import { Consumer } from "../user/consumer";

@ObjectType()
@Entity() export class PaymentMethod extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    type: PaymentType.debitCard | PaymentType.creditCard | PaymentType.payPal

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => Consumer, consumer => consumer.paymentMethods)
    @JoinColumn({ name: 'userId' })
    @Field(type => Consumer)
    consumer: Consumer;

}