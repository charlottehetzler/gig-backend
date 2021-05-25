import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Skill } from '../entity/skill';
import { GigUser } from '../entity/gigUser';
import { getRepository, Not } from 'typeorm';
import { Review } from '../entity/review';
import { ChatRoom } from '../entity/chatRoom';
import { ChatRoomUser } from '../entity/chatRoomUser';
import { SkillUserRelation } from '../entity/skillUserRelation';
import { Language } from '../entity/language';
import { LanguageUserRelation } from '../entity/languageUserRelation';
import { Friend, FRIEND_STATUS } from '../entity/friend';
import { LanguageResolver } from './language';
import { FriendResolver } from './friend';

@InputType()
export class UserQuery {
    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    currentUserId?: number;

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
    
    @Field({ nullable: true })
    nativeLanguage?: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field({ nullable: true })
    isCallable?: boolean;

}


@Resolver(of => GigUser)
export class UserResolver {

    constructor(
        private readonly languageResolver: LanguageResolver,
        private readonly friendResolver: FriendResolver,
    ) { }

    @Query(returns => [GigUser])
    async getProducersForSkill (
        @Arg('query', () => UserQuery) query: UserQuery,
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <GigUser[]> {
            let producers : GigUser[] = [];
            const relations = await SkillUserRelation.find({where: {skillId: query.skillId}});

            for (const relation of relations) {
                if (relation.userId !== query.currentUserId) {
                    const user = await GigUser.findOne({where: {id: relation.userId}, relations: ['reviews']});
                    producers.push(user);
                }
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

    @Query(returns => [GigUser])
    async getNewUsers (@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser[]> {
        let allFriends: GigUser[] = [];

        let newUsers = await GigUser.find({ where: {id: Not(query.currentUserId)}, order: {createdAt: 'DESC'}, take: 8 });
        
        const friends = await Friend.find({where: {currentUserId: query.currentUserId, status: Not('declined')} });
        for (const friend of friends) {
            const user = await GigUser.findOne(friend.userId);
            allFriends.push(user);
        }

        for (var i = 0, len = allFriends.length; i < len; i++) { 
            for (var j = 0, len2 = newUsers.length; j < len2; j++) { 
                if (allFriends[i].id === newUsers[j].id) {
                    newUsers.splice(j, 1);
                    len2=newUsers.length;
                }
            }
        }
        return newUsers;
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

    @FieldResolver(() => [Language])
    async languages(@Root() user: GigUser) {
        let languages: Language[] = [];
        const relations = await LanguageUserRelation.find({ where: {user: user, isActive: true} });
        for (const relation of relations) {
            const language =  await Language.findOne(relation.languageId);
            languages.push(language);
        }
        return languages;
    };

    @FieldResolver(() => [ChatRoom])
    async allChatRooms(@Root() user: GigUser) {
        const chatRoomUsers = await ChatRoomUser.find({where: {user: user}, relations: ['chatRoom', 'user'] });
        let chatRooms : ChatRoom[] = [];
        for (const chatRoomUser of chatRoomUsers) {
            const chatRoom = await ChatRoom.findOne(chatRoomUser.chatRoom.id);
            chatRooms.push(chatRoom);
        };
        chatRooms = chatRooms.sort((a:any , b:any) => b.updatedAt - a.updatedAt)
        return chatRooms;
    };
    
    @FieldResolver(() => [Review])
    async lastReviews(@Root() user: GigUser) {
        return await Review.find({where: {user: user}, take: 10, order: {createdAt: 'DESC'}});
    };

    @FieldResolver(() => Number)
    async totalFriends(@Root() user: GigUser) {
        const friends = await Friend.findAndCount({where: {currentUserId: user.id, status: FRIEND_STATUS.accepted} });
        return friends[1];
    };

    @Mutation(() => GigUser)
    async updateProfile(@Arg('input') input: UserQuery): Promise<GigUser> {
        try {
            let data = (input as unknown) as GigUser;
            let query: any = undefined;
            if (input.userId) query = { id: input.userId };
            if (query !== undefined) {
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
        } catch (error) {
            throw `UserResolver.updateProfile errored. Error-Msg.: ${error}`;
        }
    }

    static async getReviewGiver(reviewId: number) : Promise <GigUser> {
        const review = await Review.findOne({where: {id: reviewId}, relations: ['user']});
        return await GigUser.findOne(review.fromUserId);
    }
}
