import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Skill } from '../entity/skill';
import { GigUser } from '../entity/gigUser';
import { getRepository } from 'typeorm';
import { Review } from '../entity/review';
import { ChatRoom } from '../entity/chatRoom';
import { ChatRoomUser } from '../entity/chatRoomUser';
import { SkillUserRelation } from '../entity/skillUserRelation';

@InputType()
export class UserQuery {
    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    skillId?: number;
  
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

@InputType()
export class ReviewQuery {
    @Field({ nullable: true })
    reviewId?: number;

    @Field({ nullable: true })
    fromUserId?: number;

    @Field({ nullable: true })
    toUserId?: number;

    @Field({ nullable: true })
    rating?: number;
  
    @Field({ nullable: false })
    comment?: string;
}

@Resolver(of => GigUser)
export class UserResolver {

    @Query(returns => [GigUser])
    async getProducersForSkill (
        @Arg('query', () => UserQuery) query: UserQuery,
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <GigUser[]> {
            let producers : GigUser[] = [];
            const relations = await SkillUserRelation.find({where: {skillId: query.skillId}});
            for (const relation of relations) {
                const user = await GigUser.findOne({where: {id: relation.userId}, relations: ['reviews']});
                producers.push(user);
            }
            return producers;
    }

    @Query(returns => [GigUser])
    async getOneProducer(@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId, isConsumer: false}});
    }

    @Query(returns => GigUser)
    async getUser(@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId}, relations: ['reviews', 'chatRoomUsers', 'messages']})
    }

    @Query(returns => GigUser)
    async getUserForChat (@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId}, relations: ['reviews', 'chatRoomUsers', 'messages']})
    }

    @Query(returns =>[Review])
    async getReviewsForUser (@Arg('userId') userId: number) : Promise <Review[]> {
        const user = await GigUser.findOne(userId);
        return await Review.find({where: {user: user}});
    }

    @FieldResolver(() => Number)
    async avgRating(@Root() user: GigUser) {
        const reviews = await Review.find({where: {user: user}, relations: ['user']})

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
    
    @FieldResolver(() => [Review])
    async lastReviews(@Root() user: GigUser) {
        return await Review.find({where: {user: user}, take: 10, order: {createdAt: 'DESC'}});
    };


    @Mutation(() => GigUser)
    async updateProfile(@Arg('input') input: UserQuery): Promise<GigUser> {
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

    static async getReviewGiver(reviewId: number) : Promise <GigUser> {
        const review = await Review.findOne({where: {id: reviewId}, relations: ['user']});
        return await GigUser.findOne(review.fromUserId);
    }
}
