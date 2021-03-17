import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, Column, ManyToOne } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { GigUser } from "./gigUser";
import { ChatRoom } from "./chatRoom";

@ObjectType()
@Entity() export class ChatRoomUser extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @ManyToOne(type => GigUser, user => user.chatRoomUsers)
    @JoinColumn({ name: 'userId' })
    @Field(type => GigUser)
    user: GigUser;

    @ManyToOne(type => ChatRoom, chatRoom => chatRoom.chatRoomUsers)
    @JoinColumn({ name: 'chatRoomId' })
    @Field(type => ChatRoom)
    chatRoom: ChatRoom;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

}