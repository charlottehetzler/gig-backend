import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { GigUser } from '../entity/gigUser';
import { Friend, FRIEND_STATUS } from '../entity/friend';

@InputType()
export class FriendQuery {
    @Field({ nullable: false })
    currentUserId: number;

    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    take?: number;
}

@Resolver(of => Friend)
export class FriendResolver {

    @Query(returns => [GigUser])
    async getFriendsForUser (
        @Arg('query', () => FriendQuery) query: FriendQuery
    ) : Promise <GigUser[]> {
        try {
            let allFriends: GigUser[] = [];
            let friends: Friend[];
            if (query.take) {
                friends = await Friend.find({where: {currentUserId: query.currentUserId, status: FRIEND_STATUS.accepted}, order: {createdAt: 'DESC'}, take: query.take });
            } else {
                friends = await Friend.find({where: {currentUserId: query.currentUserId, status: FRIEND_STATUS.accepted}, order: {createdAt: 'DESC'}});
            }
            for (const friend of friends) {
                const user = await GigUser.findOne(friend.userId);
                allFriends.push(user);
            }
            return allFriends;
        } catch (error) {
            throw new Error (`FriendResolver.getLatestFriendsForUser errored. Error-Msg.: ${error}`);      
        }
    }

    @Query(returns => Number)
    async getNumberOfFriendsForUser (
        @Arg('query', () => FriendQuery) query: FriendQuery
    ): Promise <Number> {
        try {
            const friends = await Friend.findAndCount({where: {currentUserId: query.currentUserId, status: FRIEND_STATUS.accepted} });
            return friends[1]
        } catch (error) {
            throw new Error (`FriendResolver.getLatestFriendsForUser errored. Error-Msg.: ${error}`);      
        }
    }

    @Query(returns => [GigUser])
    async getFriendRequestsForUser (
        @Arg('query', () => FriendQuery) query: FriendQuery
    ) : Promise <GigUser[]> {
        try {
            let allRequests: GigUser[] = [];
            const friends = await Friend.find({where: {currentUserId: query.currentUserId, status: FRIEND_STATUS.pending}, order: {createdAt: 'DESC'} });
            for (const friend of friends) {
                const user = await GigUser.findOne(friend.userId);
                allRequests.push(user);
            }
            return allRequests;
        } catch (error) {
            throw new Error (`FriendResolver.getFriendRequestsForUser errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(returns => Friend)
    async acceptOrDeclineRequest (
        @Arg('input', () => FriendQuery) input: FriendQuery
    ) : Promise <Friend> {
        try {
            const friend = await Friend.findOne({where: {currentUserId: input.currentUserId, userId: input.userId, status: FRIEND_STATUS.pending}, order: {createdAt: 'DESC'} });
            
            if (input.status === 'accept') {
                friend.status = FRIEND_STATUS.accepted;
            } else {
                friend.status = FRIEND_STATUS.declined;
            }

            await friend.save()
            return friend;
        } catch (error) {
            throw new Error (`FriendResolver.acceptOrDeclineRequest errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(returns => Friend)
    async sendFriendRequest (
        @Arg('input', () => FriendQuery) input: FriendQuery
    ) : Promise <Friend> {
        try {
            const friend = new Friend();
            friend.currentUserId = input.currentUserId;
            friend.userId = input.userId;
            friend.status = FRIEND_STATUS.pending;
            await friend.save();
            return friend;
        } catch (error) {
            throw new Error (`FriendResolver.acceptOrDeclineRequest errored. Error-Msg.: ${error}`);      
        }
    }
    
}
