import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { Skill } from '../entity/skill';
import { GigUser } from '../entity/gigUser';
import { getRepository } from 'typeorm';
import { Review } from '../entity/review';

@InputType()
export class UserQuery {
    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    skillId?: number;
  
    @Field({ nullable: false })
    firstName?: string;

    @Field({ nullable: false })
    lastName?: string;

    @Field({ nullable: false })
    email?: string;

    @Field({ nullable: false })
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

@Resolver()
export class UserResolver {
//PRODUCERS
    // Get Producers for Gig
    @Query(returns => [GigUser])
    async getProducersForSkill (
        @Arg('query', () => UserQuery) query: UserQuery,
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <GigUser[]> {
            const skill = await Skill.findOne(query.skillId);
            return await GigUser.find({where: {skill: skill, isConsumer: false}, relations: ['skill'] });
    }

    // Get one producer 
    @Query(returns => [GigUser])
    async getOneProducer(@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId, isConsumer: false}});
    }

//PROFILE
    // Get Profile Info
    @Query(returns => GigUser)
    async getUser (@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId}, relations: ['reviews']})
    }

    //update Profile
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


    //get all reviews for user
    @Query(returns =>[Review])
    async getReviewsForUser (@Arg('userId') userId: number) : Promise <Review[]> {
        const user = await GigUser.findOne(userId);
        return await Review.find({where: {user: user}});
    }

    //add a review
    @Mutation(() => Review)
    async addReview(@Arg('input') input: ReviewQuery): Promise<Review> {
        let data = (input as unknown) as Review;
        
        let query: any = undefined;
        if(input.reviewId) query = { id: input.reviewId };
        if(query !== undefined) {
            const existing = await getRepository(Review).findOne(query);
            if (existing) {
                const tmp: any = {
                    ...existing,
                    ...input
                };
                data = tmp as Review;
            }
        }
        const review = await getRepository(Review).save(data);
        return review;
    }
}
