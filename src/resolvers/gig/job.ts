import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation, Authorized } from 'type-graphql';
import { Category } from '../../entity/gig/category';
import { Job } from '../../entity/gig/job';
import { Producer } from '../../entity/user/producer';
import { JobProducerRelation } from '../../entity/gig/jobProducerRelation';
import { JobProducerRelationResolver } from './jobProducerRelation';
import logger from '../../logger/logger';

@InputType()
export class JobQuery {
  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  jobId?: number;

  @Field({ nullable: true })
  producerId?: number;
  
  @Field({ nullable: true })
  userId?: number;

  @Field({nullable: true})
  name?: string;
}

@Resolver(of => Job)
export class JobResolver {

  @Query(returns => [Job])
  async getAllJobsForProducerOrCategory (
    @Arg('query', () => JobQuery) query: JobQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Job[]> {
      try {
        let newQuery = {};
        if (query.categoryId) {
          const category = await Category.findOne(query.categoryId);
          newQuery['category'] = category;
        }
        if (query.producerId) {
          const producer = await Producer.findOne(query.producerId);
          const jobProducerRelation = await JobProducerRelation.findOne({where: {producer: producer}});
          newQuery['producer'] = jobProducerRelation.producerId;
        }
        return await Job.find({ where: newQuery, take: first, skip: offset, relations: ['category']});

      } catch (error) {
        throw `JobResolver.getAllJobsForProducerOrCategory errored: Error-Msg: ${error}`
      }
  }
  @Query(returns => [Job])
  async getAllJobsForProducer (
    @Arg('query', () => JobQuery) query: JobQuery
    ) : Promise <Job[]> {
      try {
        return await JobProducerRelationResolver.getJobsForProducer(query.userId)
      } catch (error) {
        throw `JobResolver.getAllJobsForProducer errored: Error-Msg: ${error}`
      }
  }

  @Query(returns => [Job])
  async getAllJobs (
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
  ) : Promise <Job[]> {
    try {
      return await Job.find({take: first, skip: offset, relations: ['category']});
    } catch (error) {
      throw `JobResolver.getAllJobs errored: Error-Msg: ${error}`
    }
  }

  @Query(returns => Job)
  async getOneJob (@Arg('query', () => JobQuery) query: JobQuery) : Promise <Job> {
    try {
      return await Job.findOne(query.jobId);
    } catch (error) {
      throw `JobResolver.getOneJob errored: Error-Msg: ${error}`
    }
  }

  @FieldResolver(() => [JobProducerRelation])
  async producers(@Root() job: Job) {
    return await JobProducerRelationResolver.getProducersForJob({ jobId: job.id }, 0, 0);
  };

  @FieldResolver(() => Category)
  async gigCategory(@Root() job: Job) {
    return await Category.findOne(job.category)
  };

  // Add Job
  @Mutation(() => Job)
  async createJob(@Arg('input') input: JobQuery): Promise<Job> {
    try {
      logger.info(`creating job for producer ${input.producerId} and job ${input.name}`)
      
      const producer = await Producer.findOne(input.producerId);
      const taken = await Job.findOne({where: {producer: producer, name: input.name}});
      if (taken) throw `You already signed up for this job.`;
      const category = await Category.findOne(input.categoryId);
      
      const job = new Job();
      job.name = input.name;
      job.category = category
      const newJob = await job.save();
      
      const relation = new JobProducerRelation();
      relation.job = newJob;
      relation.jobId = newJob.id;
      relation.producerId = input.producerId;
      relation.producer = producer;
      await relation.save();
      
      logger.info(`Successfull created new Job${newJob.name, newJob.id}`)
      return newJob;

    } catch (error) {
      throw `JobResolver.createJob errored: Error-Msg: ${error}`
    }
  }

  static async getAllJobsForUser (query: JobQuery, first: number, offset: number) : Promise<Job[]> {
    try {
      let newQuery = {};
      if (query.categoryId) {
        const category = await Category.findOne(query.categoryId);
        newQuery['category'] = category;
      }
      if (query.producerId) {
        const producer = await Producer.findOne(query.producerId);
        newQuery['producer'] = producer;
      }
      return await Job.find({ where: newQuery, take: first, skip: offset, relations: ['category', 'producer']});

    } catch (error) {
      throw `errored: Error-Msg: ${error}`;
    }
  }

}
