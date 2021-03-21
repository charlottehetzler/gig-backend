import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { getRepository } from 'typeorm';
import { UserResolver } from './user';
import { Review } from '../entity/review';
import { GigUser } from '../entity/gigUser';

@InputType()
export class ReviewQuery {
    @Field({ nullable: true })
    reviewId?: number;

    @Field({ nullable: true })
    fromUserId?: number;

    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    rating?: string;
  
    @Field({ nullable: true })
    comment?: string;
}

@Resolver(of => Review)
export class ReviewResolver {

  // Home Screen - All Gigs & Browse Random
  @Query(returns => [Review])
  async getReviewsForUser (
    @Arg('query') query : ReviewQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
  ) : Promise <Review[]> {
    const user = await GigUser.findOne(query.userId);
    return await Review.find({where: {user: user}, order: {createdAt: 'DESC'}});
  }

  @Query(returns => [Review])
  async getLastReviewsForUser (@Arg('query') query : ReviewQuery) {
    const user = await GigUser.findOne(query.userId);
    return await Review.find({where: {user: user}, take: 10, order: {createdAt: 'DESC'}});
  }

  //TODO: include skill relation
  @Query(returns => Boolean)
  async getSubmittedReview (@Arg('query') query : ReviewQuery) {
    const user = await GigUser.findOne(query.userId);
    const submittedReview = await Review.findOne({where: {user: user, fromUserId: query.fromUserId} });
    if (submittedReview) {
      return true;
    } else {
      return false;
    }
  }


  @FieldResolver(() => GigUser)
  async fromUser(@Root() review: Review) {
    return await UserResolver.getReviewGiver(review.id);
  };

  //add a review
  @Mutation(() => Review)
  async addReview(@Arg('input') input: ReviewQuery): Promise<Review> {
    const user = await GigUser.findOne(input.userId);
    if (user) {
      const review = new Review();
      review.user = user;
      review.fromUserId = input.fromUserId;
      review.rating = input.rating;
      review.comment = input.comment;
      await review.save();
      return review;
    } else {
      throw `ReviewResolver.addReview errored for input: ${input}`;
    }
  }
  
  static async getReviewsForUser(userId: number) : Promise <Review[]> {
    const user = await GigUser.findOne(userId);
    return await Review.find({where: {userId: user.id}});
  }
}