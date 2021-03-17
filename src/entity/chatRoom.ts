import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,  OneToMany, Column } from "typeorm";
import { Field, ObjectType, GraphQLISODateTime } from "type-graphql";
import { Message } from "./message";
import { ChatRoomUser } from "./chatRoomUser";

@ObjectType()
@Entity() export class ChatRoom extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column( {nullable: true} )
    @Field({nullable: true})
    lastMessageId: number;

    @OneToMany(type => Message, message => message.chatRoom, {cascade: true})
    @Field(type => [Message], { nullable: true })
    messages: Message[];

    @OneToMany(type => ChatRoomUser, chatRoomUser => chatRoomUser.chatRoom, {cascade: true})
    @Field(type => [ChatRoomUser], { nullable: true })
    chatRoomUsers: ChatRoomUser[];

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;
    
    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

}