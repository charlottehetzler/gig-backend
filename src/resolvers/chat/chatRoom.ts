import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Message } from '../../entity/chat/message';
import { ChatRoom } from '../../entity/chat/chatRoom';
import { GigUser } from '../../entity/user/gigUser';
import { ChatRoomUser } from '../../entity/chat/chatRoomUser';
import { getManager } from 'typeorm';

@InputType()
export class ChatRoomQuery {
    @Field({ nullable: false })
    userId: number;
}

@InputType()
export class ChatRoomInput {
    @Field({ nullable: false })
    lastMessageId: number;

    @Field({ nullable: false })
    chatRoomId: number;
}

@Resolver(of => ChatRoom)
export class ChatRoomResolver {

    @Query(returns => [ChatRoom])
    async getChatRoomsForUser (
        @Arg('query', () => ChatRoomQuery) query: ChatRoomQuery,
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <ChatRoom[]> {
        try {
            const user = await GigUser.findOne({where: {id: query.userId}});
            const chatRoomUsers = await ChatRoomUser.find({where: {user: user}, relations: ['chatRoom', 'user']});
            let chatRooms = [];
            for (const chatRoomUser of chatRoomUsers) {
                const chatRoom = await ChatRoom.findOne(chatRoomUser.chatRoom.id);
                chatRooms.push(chatRoom);
            }
            chatRooms.sort((a: ChatRoom, b: ChatRoom) => {
                return a.updatedAt.getTime() - b.updatedAt.getTime();
            });
            return chatRooms;
        } catch (error) {
            throw `ChatRoomResolver.getMessagesByChatRoom errored. Error Msg: ${error}`;            
        }
    }

    @Mutation(() => ChatRoom)
    async updateChatRoomLastMessage(@Arg('input', () => ChatRoomInput) input: ChatRoomInput) : Promise <ChatRoom>{
        try {
            const chatRoom = await ChatRoom.findOne(input.chatRoomId);
            chatRoom.lastMessageId = input.lastMessageId;
            await chatRoom.save();
            return chatRoom;
        } catch (error) {
            throw `ChatRoomResolver.updateChatRoomLastMessage errored for chatRoom: ${input.chatRoomId}, lastMessageId: ${input.lastMessageId}. Error Msg: ${error}`;
        }
    }

    @FieldResolver(() => Message)
    async lastMessage(@Root() chatRoom: ChatRoom) : Promise <Message> {
        return await Message.findOne({where: {id: chatRoom.lastMessageId}, relations: ['user']});
    };

    @FieldResolver(() => [ChatRoomUser])
    async members(@Root() chatRoom: ChatRoom) : Promise <ChatRoomUser[]> {
        return await ChatRoomUser.find({where: {chatRoom: chatRoom}, relations:['user']});
    };
}
