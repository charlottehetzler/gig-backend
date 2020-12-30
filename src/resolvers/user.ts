import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { Job } from '../entity/gig/job';
import { Producer } from '../entity/user/producer';
import { Gig } from '../entity/gig/gig';
import { GigUser } from '../entity/user/gigUser';
import { Address } from '../entity/user/address';
import { getRepository } from 'typeorm';
import { Review } from '../entity/user/review';

@InputType()
export class UserQuery {
    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    gigId?: number;

    @Field({ nullable: true })
    producerId?: number;
  
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
export class AddressQuery {  
    @Field({ nullable: true })
    addressId: number;

    @Field({ nullable: true })
    streetRoadName: string;

    @Field({ nullable: true })
    houseNumber: string;

    @Field({ nullable: true })
    apartmentSuiteNo: string;

    @Field({ nullable: true })
    zipPostalCode: string;

    @Field({ nullable: true })
    cityTownVillageLocality: string;

    @Field({ nullable: true })
    stateCounty: string;

    @Field({ nullable: true })
    region: string;

    @Field({ nullable: true })
    country: string;

    @Field({ nullable: true })
    note: string;

    @Field({ nullable: true })
    userId: number;
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
    @Query(returns => [Producer])
    async getProducersForJob (
        @Arg('query', () => UserQuery) query: UserQuery,
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Producer[]> {
            const gig = await Gig.findOne(query.gigId);
            const job = await Job.findOne(gig.job);
            return await Producer.find({where: {job: job}, relations: ['user'] });
    }

    // Get one producer 
    @Query(returns => [Producer])
    async getOneProducer(@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
            const producer = await Producer.findOne(query.producerId);
            return await GigUser.findOne(producer.user);
    }

//PROFILE
    // Get Profile Info
    @Query(returns => GigUser)
    async getUser (@Arg('query', () => UserQuery) query: UserQuery) : Promise <GigUser> {
        return await GigUser.findOne({where: {id: query.userId}, relations: ['addresses', 'reviews']})
    }

    //update + add Address
    @Mutation(() => Address)
    async updateAddress(@Arg('input') input: AddressQuery): Promise<Address> {
        let data = (input as unknown) as Address;
        
        let query: any = undefined;
        if(input.addressId) query = { gigId: input.addressId };
        if(query !== undefined) {
            const existing = await getRepository(Address).findOne(query);
            if (existing) {
                const tmp: any = {
                    ...existing,
                    ...input
                };
                data = tmp as Address;
            }
        }
        const address = await getRepository(Address).save(data);
        return address;
    }

    //update Profile
    @Mutation(() => Address)
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

//REVIEWS
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
