import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { GigUser } from '../../entity/user/gigUser';
import { Address } from '../../entity/user/address';
import { getRepository } from 'typeorm';
import { Review } from '../../entity/user/review';
import { ChatRoom } from '../../entity/chat/chatRoom';
import { ChatRoomUser } from '../../entity/chat/chatRoomUser';


@InputType()
export class UserQuery {
    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    gigId?: number;

    @Field({ nullable: true })
    jobId?: number;
}

@InputType()
export class UserInput{
    @Field({ nullable: false })
    userId?: number;

    @Field({ nullable: true })
    gigId?: number;

    @Field({ nullable: true })
    jobId?: number;

    @Field({ nullable: true })
    producerId?: number;
  
    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    birthday?: Date;

    @Field({ nullable: true })
    profilePicture?: string;
}


@Resolver(of => GigUser)
export class UserResolver {

    // Get Profile Info
    @Query(returns => GigUser)
    async getUser (@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId}, relations: ['addresses', 'reviews', 'chatRoomUsers', 'messages']})
    }

    @Query(returns => GigUser)
    async getUserForChat (@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId}, relations: ['addresses', 'reviews', 'chatRoomUsers', 'messages']})
    }

    //update Profile
    @Mutation(() => Address)
    async updateProfile(@Arg('input') input: UserInput): Promise<GigUser> {
        let data = (input as unknown) as GigUser;
        
        let query: any = undefined;
        if(input.userId) query = { id: input.userId };
        if(query !== undefined) {
            const existing = await getRepository(GigUser).findOne(query);
            if (existing) {
                const tmp: any = {
                    ...existing,
                    ...input
                };
                data = tmp as GigUser;
            }
        }
        const user = await getRepository(GigUser).save(data);
        return user;
    }

    @FieldResolver(() => Number)
    async avgRating(@Root() user: GigUser) {
        const reviews = await Review.find({where: {user: user}})
        
        let reviewCount = 0;
        let ratingCount = 0;
        let averageRating = 0;
        
        for (const review of reviews) {
            reviewCount += 1;
            ratingCount += parseInt(review.rating);
        } 
        if (reviewCount !== 0) averageRating = ratingCount / reviewCount;
        
        return averageRating.toFixed(2);
    };

    @FieldResolver(() => [ChatRoom])
    async allChatRooms(@Root() user: GigUser) {
        const chatRoomUsers = await ChatRoomUser.find({where: {user: user}, relations: ['chatRoom', 'user'], order: {updatedAt: 'DESC'}});
        let chatRooms : ChatRoom[] = [];
        for (const chatRoomUser of chatRoomUsers) {
            const chatRoom = await ChatRoom.findOne(chatRoomUser.chatRoom.id);
            chatRooms.push(chatRoom);
        };
        return chatRooms;
    };

    @FieldResolver(() => [ChatRoom])
    async lastReview(@Root() user: GigUser) {
        return await Review.findOne({where: {user: user}, order: {createdAt: 'DESC'}});
    };

    static async getReviewGiver(reviewId: number) : Promise <GigUser> {
        const review = await Review.findOne({where: {id: reviewId}, relations: ['user']});
        return await GigUser.findOne(review.fromUserId);
    }
}
