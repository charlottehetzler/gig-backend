import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { Review } from "./review";
import { ChatRoomUser } from "./chatRoomUser";
import { Message } from "./message";

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

    @Column({ nullable: false, default: true })
    @Field({ nullable: false })
    isConsumer: boolean;

    @Column({ nullable: false, default: 'English' })
    @Field({ nullable: false })
    nativeLanguage: string;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @OneToMany(type => Review, review => review.user, {cascade: true})
    @Field(type => [Review], { nullable: true })
    reviews: Review[];

    @OneToMany(type => ChatRoomUser, chatRoomUser => chatRoomUser.user, {cascade: true})
    @Field(type => [ChatRoomUser], { nullable: true })
    chatRoomUsers: ChatRoomUser[];

    @OneToMany(type => Message, message => message.user, {cascade: true})
    @Field(type => [Message], { nullable: true })
    messages: Message[];
}