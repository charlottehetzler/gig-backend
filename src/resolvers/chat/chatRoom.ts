import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Message } from '../../entity/chat/message';
import { ChatRoom } from '../../entity/chat/chatRoom';
import { GigUser } from '../../entity/user/gigUser';
import { ChatRoomUser } from '../../entity/chat/chatRoomUser';

@InputType()
export class ChatRoomQuery {
    @Field({ nullable: false })
    userId: number;
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
            const user = await GigUser.findOne(query.userId);
            const chatRoomUsers = await ChatRoomUser.find({where: {user: user}, relations: ['chatRoom', 'user']});
            let chatRooms = [];
            for (const chatRoomUser of chatRoomUsers) {
                const chatRoom = await ChatRoom.findOne(chatRoomUser.chatRoom.id);
                chatRooms.push(chatRoom);
            }
            return chatRooms;
        } catch (error) {
            throw `MessageResolver.getMessagesByChatRoom errored. Error Msg: ${error}`;            
        }
    }

    @FieldResolver(() => Message)
    async lastMessage(@Root() chatRoom: ChatRoom) : Promise <Message> {
        return await Message.findOne({where: {chatRoom: chatRoom}, order: {createdAt: 'DESC'}, relations: ['user']});
    };
}
