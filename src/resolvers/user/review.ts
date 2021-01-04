import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { Review } from '../../entity/user/review';
import { GigUser } from '../../entity/user/gigUser';
import { getRepository } from 'typeorm';
import { Producer } from '../../entity/user/producer';
import { Gig } from '../../entity/gig/gig';
import { UserResolver } from './user';

@InputType()
export class ReviewQuery {
    @Field({ nullable: true })
    reviewId?: number;

    @Field({ nullable: true })
    fromUserId?: number;

    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    rating?: number;
  
    @Field({ nullable: true })
    comment?: string;
}

@Resolver(of => Review)
export class ReviewResolver {

  // Home Screen - All Gigs & Browse Random
  @Query(returns => [Review])
  async getReviewsForUser (
    @Arg('query') query : ReviewQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
  ) : Promise <Review[]> {
    const user = await GigUser.findOne(query.userId);
    return await Review.find({where: {user: user}, order: {createdAt: 'DESC'}});
  }

  @Query(returns => Review)
  async getLastReviewForUser (@Arg('query') query : ReviewQuery) {
    const user = await GigUser.findOne(query.userId);
    return await Review.findOne({where: {user: user}, order: {createdAt: 'DESC'}});
  }

  @FieldResolver(() => GigUser)
  async fromUser(@Root() review: Review) {
    return await UserResolver.getReviewGiver(review.id);
  };

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

  static async getReviewsForProducer(producerId: number) : Promise <Review[]> {
    const producer = await Producer.findOne({where: {id: producerId}, relations: ['user']});
    const user = await GigUser.findOne(producer.user.id);
    return await Review.find({where: {user: producer.user}});
  }

  static async getReviewsForUser(userId: number) : Promise <Review[]> {
    const user = await GigUser.findOne(userId);
    return await Review.find({where: {userId: user.id}});
  }
}
