import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { getRepository } from 'typeorm';
import { UserResolver } from './user';
import { Review } from '../entity/review';
import { GigUser } from '../entity/gigUser';
import { Skill } from '../entity/skill';

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

    @Field({ nullable: true })
    skillId?: number;
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
    let reviews;
    if (query.skillId) {
      const skill = await Skill.findOne(query.skillId);
      reviews = Review.find({ where: {user: user, skill: skill}, order: {createdAt: 'DESC'} });
    } else {
      reviews = Review.find({ where: {user: user}, order: {createdAt: 'DESC'} });
    }
    return reviews;
  }

  @Query(returns => [Review])
  async getLastReviewsForUser (@Arg('query') query : ReviewQuery): Promise<Review[]> {
    const user = await GigUser.findOne(query.userId);
    let reviews;
    if (query.skillId) {
      const skill = await Skill.findOne(query.skillId);
      reviews = await Review.find({ where: {user: user, skill: skill}, take: 10, order: {createdAt: 'DESC'} });
    } else {
      reviews = await Review.find({ where: {user: user}, take: 10, order: {createdAt: 'DESC'} });
    }
    return reviews;
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

  @Query(returns => Number)
  async getAvgRatingForSkill (@Arg('query') query : ReviewQuery) {
    const user = await GigUser.findOne(query.userId);
    const skill = await Skill.findOne(query.skillId);
    const reviews = await Review.find({ where: {user: user, skill: skill}, order: {createdAt: 'DESC'} });
    
    let reviewCount = 0;
    let ratingCount = 0;
    let averageRating = 0;
    
    for (const review of reviews) {
        reviewCount += 1;
        ratingCount += parseInt(review.rating);
    } 
    if (reviewCount !== 0) averageRating = ratingCount / reviewCount;
    
    return averageRating.toFixed(2);
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
      
      if (input.skillId) {
        const skill =  await Skill.findOne(input.skillId);
        if (skill) {
          review.skill = skill;
          review.skillId = skill.id;  
        }
      }
      
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