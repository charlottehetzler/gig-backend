import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Producer } from '../../entity/user/producer';
import { Review } from '../../entity/user/review';
import { JobProducerRelation } from '../../entity/gig/jobProducerRelation';
import { ReviewResolver } from './review';
import { Gig } from '../../entity/gig/gig';

@InputType()
export class ProducerQuery {
    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    producerId?: number;

    @Field({ nullable: true })
    jobId?: number;
}

@Resolver(of => Producer)
export class ProducerResolver {

    @Query(returns => [Producer])
    async getProducersForJob (
        @Arg('query', () => ProducerQuery) query: ProducerQuery,
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Producer[]> {
        if (query.jobId) {
            let producers : Producer[] = [];
            const relations = await JobProducerRelation.find({where: {jobId: query.jobId}});
            for (const relation of relations) {
                const producer = await Producer.findOne({where: {id: relation.producerId}, relations: ['user', 'gigs']});
                producers.push(producer);
            }
            return producers;
        }
    }

    @Query(returns => [Producer])
    async getOneProducer(@Arg('query', () => ProducerQuery) query: ProducerQuery) : Promise <Producer> {
        return await Producer.findOne({where: {id: query.producerId}, relations: ['user']});
    }

    @FieldResolver(() => [Review])
    async reviews(@Root() producer: Producer) {
      return await ReviewResolver.getReviewsForProducer(producer.id);
    };

    @FieldResolver(() => Gig)
    async lastGig(@Root() producer: Producer) {
        const lastGig = await Gig.findOne({where: {producer: producer}, order: {date: 'DESC'}})
        return lastGig
    };
    
}
