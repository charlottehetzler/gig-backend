import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { Job } from '../../entity/gig/job';
import { Gig } from '../../entity/gig/gig';
import { Consumer } from '../../entity/user/consumer';
import { Producer } from '../../entity/user/producer';
import { getManager, getRepository, Not } from 'typeorm';

@InputType()
export class GigQuery {
    @Field({ nullable: false })
    title: string;
    
    @Field({ nullable: false })
    price: number;
    
    @Field({ nullable: false })
    status: string;

    @Field({ nullable: false })
    date: Date;

    @Field({ nullable: false })
    time: Date;
    
    @Field({ nullable: false })
    description: string;
    
    @Field({ nullable: false })
    jobId: number;

    @Field({ nullable: false })
    consumerId: number;
  
    @Field( { nullable: false })
    producerId: number;
}

@InputType()
export class GigInput {
    @Field({ nullable: true })
    title?: string;
    
    @Field({ nullable: true })
    price?: number;
    
    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    date?: Date;

    @Field({ nullable: true })
    time?: Date;
    
    @Field({ nullable: true })
    description?: string;
    
    @Field({ nullable: true })
    jobId?: number;

    @Field({ nullable: true })
    consumerId?: number;
  
    @Field( { nullable: true })
    producerId?: number;

    @Field({ nullable: false })
    gigId: number;
}

@InputType()
export class GigUserQuery {    
    @Field({ nullable: true })
    consumerId?: number;
  
    @Field( { nullable: true })
    producerId?: number;
}

@Resolver()
export class GigResolver {
    // Account History
    @Query(returns => [Gig])
    async getAllGigsForUser (
    @Arg('query', () => GigUserQuery) query: GigUserQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Gig[]> {
        try {
            let newQuery = {};
            if (query.producerId) {
                const producer = await Producer.findOne(query.producerId);
                newQuery['producer'] = producer;
            }
            if (query.consumerId) {
                const consumer = await Consumer.findOne(query.consumerId);
                newQuery['consumer'] = consumer;
            }
            return await Gig.find({where: newQuery, take: first, skip: offset, relations: ['job']})

        } catch (error) {
            throw `GigResolver.getAllGigsForUser errored. Error-Msg: ${error}`
        }
    }

    // Live Gigs
    @Query(returns => [Gig])
    async getAllActiveGigsForUser (
    @Arg('query', () => GigUserQuery) query: GigUserQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Gig[]> {
        let gigs : Gig[];
        //TODO: add date/time constraint OR status
        if (query.consumerId) {
            gigs = await Gig.find({
                where: {consumerId: query.consumerId, status: Not("cancelled")}, 
                order: {updatedAt: "DESC"}, 
            });
        } else if (query.producerId) {
            gigs = await Gig.find({
                where: {producerId: query.producerId, status: Not("cancelled")}, 
                order: {updatedAt: "DESC"}, 
            });
        }
        return gigs;
    }

    // Add Gig
    @Mutation(() => Gig)
    async createGig(@Arg('input') input: GigQuery): Promise<Gig> {
        const job = await Job.findOne(input.jobId);
        const consumer = await Consumer.findOne(input.consumerId);
        const producer = await Producer.findOne(input.producerId);
        
        const gig = new Gig();
        gig.title = input.title;
        gig.price = input.price;
        gig.status = input.status;
        gig.description = input.description;
        // gig.date = input.date;
        // gig.time = input.time;
        gig.job = job;
        gig.consumer = consumer;
        gig.producer = producer;
        return await gig.save();
    }

    // Modify Gig
    @Mutation(() => Gig)
    async updateGig(@Arg('input') input: GigInput): Promise<Gig> {
        let data = (input as unknown) as Gig;
        let query: any = undefined;
        if(input.gigId) query = { id: input.gigId };
        if(query !== undefined) {
            const existing = await getRepository(Gig).findOne(query);
            if(existing) {
                const tmp: any = {
                    ...existing,
                    ...input
                };
                data = tmp as Gig;
            }
        }

        const gig = await getRepository(Gig).save(data);
        return gig;
    }

    // Cancel Gig
    @Mutation(() => Boolean)
    async deleteGig(@Arg('input') input: GigInput): Promise<Boolean> {
        const gig = await Gig.findOne(input.gigId);
        gig.status = "cancelled";
        await gig.save();
        return true;
    }
}
