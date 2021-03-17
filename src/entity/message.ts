import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, Column, ManyToOne } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { ChatRoom } from "./chatRoom";
import { GigUser } from "./gigUser";

@ObjectType()
@Entity() export class Message extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    content: string;

    @ManyToOne(type => ChatRoom, chatRoom => chatRoom.messages)
    @JoinColumn({ name: 'chatRoomId' })
    @Field(type => ChatRoom)
    chatRoom: ChatRoom;

    @ManyToOne(type => GigUser, user => user.messages)
    @JoinColumn({ name: 'userId' })
    @Field(type => GigUser)
    user: GigUser;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

}