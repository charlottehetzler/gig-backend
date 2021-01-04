import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../../entity/gig/category';
import { Job } from '../../entity/gig/job';
import { JobResolver } from './job';
import { JobProducerRelation } from '../../entity/gig/jobProducerRelation';
import { Producer } from '../../entity/user/producer';
import { UserInput } from '../user/user';
import { GigUser } from '../../entity/user/gigUser';

@InputType()
export class JobProducerRelationQuery {
  @Field()
  producerId?: number;

  @Field()
  jobId?: number;
}

@Resolver(of => Category)
export class JobProducerRelationResolver {

  static async getProducersForJob( query: JobProducerRelationQuery, first: number, offset: number) : Promise<Producer[]> {
    try {
      if (query.jobId) {
        let producers : Producer[] = [];
        const relations = await JobProducerRelation.find({where: {jobId: query.jobId}});
        for (const relation of relations) {
          const producer = await Producer.findOne(relation.producerId);
          producers.push(producer);
        }
        return producers;
      }
    } catch (error) {
      throw `errored: Error-Msg: ${error}`;
    }
  }

  static async getJobsForProducer(userId: number)  {
    try {
      if (userId) {
        let jobs : Job[] = [];
        const user = await GigUser.findOne({where: {id: userId}, relations: ['producer']});
        const producer = await Producer.findOne({where: {user: user}})
        if (!producer) return jobs;
        const relations = await JobProducerRelation.find({where: {producerId: producer.id}});
        for (const relation of relations) {
          const job = await Job.findOne({ where: {id: relation.jobId} });
          jobs.push(job);
        }
        return jobs;
      }
    } catch (error) {
      throw `errored: Error-Msg: ${error}`;
    }
  }

}
