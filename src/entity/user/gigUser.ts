import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { Address } from "./address";
import { Review } from "./review";
import { Producer } from "./producer";
import { Consumer } from "./consumer";
import { ChatRoomUser } from "../chat/chatRoomUser";
import { Message } from "../chat/message";

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
    
    @Column({ nullable: true })
    @Field({ nullable: true })
    hashedPassword: string;

    @Column({ default: 0, nullable: true })
    @Field({ nullable: true })
    loginAttempts: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
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

    @OneToMany(type => ChatRoomUser, chatRoomUser => chatRoomUser.user, {cascade: true})
    @Field(type => [ChatRoomUser], { nullable: true })
    chatRoomUsers: ChatRoomUser[];

    @OneToMany(type => Message, message => message.user, {cascade: true})
    @Field(type => [Message], { nullable: true })
    messages: Message[];

    @OneToOne(() => Producer)
    @Field(type => Producer)
    @JoinColumn({ name: 'producerId' })
    producer: Producer;  
    
    @OneToOne(() => Consumer)
    @Field(type => Consumer)
    @JoinColumn({ name: 'consumerId' })
    consumer: Consumer;
}