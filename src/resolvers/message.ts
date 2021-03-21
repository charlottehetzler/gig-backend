import { Resolver, Query, Arg, InputType, Field, Mutation, Subscription, Root, PubSub, Publisher } from 'type-graphql';
import { Message } from '../entity/message';
import { ChatRoom } from '../entity/chatRoom';
import { GigUser } from '../entity/gigUser';

@InputType()
export class MessageQuery {
    @Field({ nullable: false })
    chatRoomId: number;
}

@InputType()
export class MessageInput {
    @Field({ nullable: false })
    chatRoomId: number;

    @Field({ nullable: false })
    userId: number;

    @Field({ nullable: false })
    content: string;
}

@Resolver(of => Message)
export class MessageResolver {

    @Query(returns => [Message])
    async getMessagesByChatRoom (
        @Arg('query', () => MessageQuery) query: MessageQuery,
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Message[]> {
        try {
            const chatRoom = await ChatRoom.findOne(query.chatRoomId);
            return await Message.find({where: {chatRoom: chatRoom}, order: {createdAt: 'DESC'}, relations: ['user', 'chatRoom']});
        } catch (error) {
            throw new Error (`ChatRoomResolver.createMessage errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(() => Message)
    async createMessage(
        @Arg('input', () => MessageInput) input: MessageInput,
        @PubSub("NEW MESSAGE") publish: Publisher<Message>,
    ) : Promise <Message> {
        try {
            const user = await GigUser.findOne(input.userId);
            const chatRoom = await ChatRoom.findOne(input.chatRoomId);
            const message = new Message();
            message.content = input.content;
            message.user = user;
            message.chatRoom = chatRoom;
            await message.save();
            await publish(message);
            return message;
        } catch (error) {
            throw new Error (`ChatRoomResolver.createMessage errored. Error-Msg.: ${error}`);      
        }
    }

    @Subscription(() => Message, {topics: "NEW MESSAGE"})
    async onCreateMessage ( @Root() message: Message) {
        return message;
    }
}
