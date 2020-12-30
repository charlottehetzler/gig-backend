import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../entity/gig/category';
import { Job } from '../entity/gig/job';
import { Producer } from '../entity/user/producer';

@InputType()
export class JobQuery {
  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  jobId?: number;

  @Field({ nullable: true })
  producerId?: number;

  @Field({nullable: true})
  name?: string;
}

@Resolver()
export class JobResolver {
  // Home Screen - All Gigs & Browse Random

  // static async getAllJobsForUser (
  //   @Arg('query', () => JobQuery) query: JobQuery,
  //   @Arg('first', { defaultValue: 10 }) first: number = 10,
  //   @Arg('offset', { defaultValue: 0 }) offset: number = 0,
  //   ) : Promise <Job[]> {
  //     return await Job.find({ where: query, take: first, skip: offset});
  // }

  @Query(returns => [Job])
  async getAllJobs (
    @Arg('query', () => JobQuery) query: JobQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Job[]> {
      try {
        console.log(query.categoryId)
        return await Job.find({ where: query, take: first, skip: offset});

      } catch (error) {
        throw `errored: Error-Msg: ${error}`
      }
  }

  @Query(returns => [Job])
  async getAllJobsTest () : Promise <Job[]> {
    try {
      return await Job.find();

    } catch (error) {
      throw `errored: Error-Msg: ${error}`
    }
  }

  // Add Job
  @Mutation(() => Job)
  async createJob(@Arg('input') input: JobQuery): Promise<Job> {
    const job = new Job();
    job.name = input.name;
    const category = await Category.findOne(input.categoryId);
    job.category = category
    return await job.save();
  }

  static async getAllJobsForUser ( query: JobQuery, first: number, offset: number) : Promise<Job[]> {
    return Job.find({ take: first, skip: offset, where: query });
}
}
