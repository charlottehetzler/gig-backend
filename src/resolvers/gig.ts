import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { Job } from '../entity/gig/job';
import { Gig } from '../entity/gig/gig';
import { Consumer } from '../entity/user/consumer';
import { Producer } from '../entity/user/producer';
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

    @Field({ nullable: true })
    consumerId?: number;
  
    @Field( { nullable: true })
    producerId?: number;

    @Field({ nullable: true })
    gigId?: number;
}

@Resolver()
export class GigResolver {
    // Account History
    @Query(returns => [Gig])
    async getAllGigsForUser (
    @Arg('query', () => GigQuery) query: GigQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Gig[]> {
        return await Gig.find({ take: first, skip: offset, where: query});
    }

    // Live Gigs
    @Query(returns => [Gig])
    async getAllActiveGigsForUser (
    @Arg('query', () => GigQuery) query: GigQuery,
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

    // @Mutation(() => Gig)
    // async createGig(@Arg('input') input: GigQuery): Promise<Gig> {
    //     const gig = new Gig();
    //     gig.title = input.title;
    //     gig.price = input.price;
    //     gig.status = input.status;
    //     gig.description = input.description;
    //     gig.job = input.job;
    //     gig.consumer = input.consumer;
    //     gig.producer = input.producer;
    //     return await gig.save();
    // }

    // Add & Modify Gig
    @Mutation(() => Gig)
    async updateGig(@Arg('input') input: GigQuery): Promise<Gig> {
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
    @Mutation(() => Gig)
    async deleteGig(@Arg('input') input: GigQuery): Promise<Gig> {
        const gig = await Gig.findOne(input.gigId);
        gig.status = "cancelled";
        return await gig.save();
    }
}
