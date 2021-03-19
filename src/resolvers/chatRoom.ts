import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Message } from '../entity/message';
import { ChatRoom } from '../entity/chatRoom';
import { GigUser } from '../entity/gigUser';
import { ChatRoomUser } from '../entity/chatRoomUser';
import { MessageResolver, MessageInput } from './message';

@InputType()
export class ChatRoomQuery {
    @Field({ nullable: false })
    userId: number;
}

@InputType()
export class ChatRoomInput {
    @Field({ nullable: false })
    lastMessageId: number;
}

@InputType()
export class NewChatInput {
    @Field({ nullable: false })
    currentUserId: number;

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

    @Query(returns => ChatRoom)
    async getCommonChatRoom (
        @Arg('currentUserId') currentUserId: number,
        @Arg('userId') userId: number
    ) : Promise <ChatRoom> {
        try {
            const currentUser = await GigUser.findOne(currentUserId);
            const user = await GigUser.findOne(userId);

            const currentUserChatRooms = await ChatRoomUser.find({where: {user: currentUser}, relations: ['user', 'chatRoom'] });
            const userChatRooms = await ChatRoomUser.find({where: {user: user}, relations: ['user', 'chatRoom'] });

            if (currentUserChatRooms.length > 0 && userChatRooms.length > 0 ) {
                return await this.getCommonChat(currentUserChatRooms, userChatRooms);
            }
            
        } catch (error) {
            throw `ChatRoomResolver.getCommonChatRoom errored. Error Msg: ${error}`;            
        }
    }

    @FieldResolver(() => Message)
    async lastMessage(@Root() chatRoom: ChatRoom): Promise <Message> {
        return await Message.findOne({where: {id: chatRoom.lastMessageId}, relations: ['user']});
    };

    @FieldResolver(() => [ChatRoomUser])
    async members(@Root() chatRoom: ChatRoom): Promise <ChatRoomUser[]> {
        return await ChatRoomUser.find({where: {chatRoom: chatRoom}, relations:['user']});
    };

    @Mutation(() => ChatRoom)
    async updateChatRoomLastMessage(@Arg('input', () => ChatRoomInput) input: ChatRoomInput) : Promise <ChatRoom>{
        try {
            const lastMessage = await Message.findOne({where: {id: input.lastMessageId}, relations: ['chatRoom']});
            const chatRoom = await ChatRoom.findOne(lastMessage.chatRoom.id);
            
            chatRoom.lastMessageId = input.lastMessageId;
            await chatRoom.save();
            return chatRoom;
        } catch (error) {
            throw `ChatRoomResolver.updateChatRoomLastMessage errored for lastMessageId: ${input.lastMessageId}. Error Msg: ${error}`;
        }
    }

    @Mutation(() => ChatRoom)
    async createChatRoom(@Arg('input', () => NewChatInput) input: NewChatInput) : Promise <ChatRoom>{
        try {
            const chatRoom = new ChatRoom();
            await chatRoom.save();
            
            const currentUser = await GigUser.findOne(input.currentUserId);
            const user = await GigUser.findOne(input.userId);

            await this.createChatRoomUser(currentUser, chatRoom);
            await this.createChatRoomUser(user, chatRoom);
            
            return chatRoom
        } catch (error) {
            throw `ChatRoomResolver.createChatRoom errored for currentUserId: ${input.currentUserId}, userId: ${input.userId}. Error Msg: ${error}`;
        }
    }

    async getCommonChat(currentUserChatRooms: ChatRoomUser[], userChatRooms: ChatRoomUser[]) {
        for (const currentUserChatRoom of currentUserChatRooms) {
            console.log(currentUserChatRoom)
            for (const userChatRoom of userChatRooms) {
                if (currentUserChatRoom.chatRoom.id === userChatRoom.chatRoom.id) {
                    return await ChatRoom.findOne(userChatRoom.chatRoom.id);
                }
            }
        }
    }

    async createChatRoomUser(user: GigUser, chatRoom: ChatRoom) : Promise <ChatRoomUser> {
        const chatRoomUser = new ChatRoomUser();
        chatRoomUser.user = user;
        chatRoomUser.chatRoom = chatRoom;
        await chatRoomUser.save();
        return chatRoomUser;
    }
}
