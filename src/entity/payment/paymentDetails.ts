import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Column} from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { PaymentMethod } from "./paymentMethod";

@ObjectType()
@Entity() export class PaymentDetails extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    userName: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    cardNumber: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    expirationDate: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    securityCode: number;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @OneToOne(() => PaymentMethod)
    @JoinColumn()
    paymentMethod: PaymentMethod; 

}