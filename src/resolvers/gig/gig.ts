import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Job } from '../../entity/gig/job';
import { Gig } from '../../entity/gig/gig';
import { Consumer } from '../../entity/user/consumer';
import { Producer } from '../../entity/user/producer';
import { getManager, getRepository, Not } from 'typeorm';
import { GigUser, UserType } from '../../entity/user/gigUser';

@InputType()
export class GigQuery {
    @Field({ nullable: false })
    title: string;
    
    @Field({ nullable: false })
    price: number;
    
    @Field({ nullable: false })
    jobId: number;

    @Field({ nullable: false })
    userId: number;

    @Field({ nullable: false })
    date: Date;
    
    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    description?: string;
    
    @Field( { nullable: true })
    producerId?: number;
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

    @Field( { nullable: true })
    userId?: number;
}

@Resolver(of => Gig)
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
            const user = await GigUser.findOne(query.userId);
            if (user.type === UserType.consumer) {
                const consumer = await Consumer.findOne({where: {user: user}});
                newQuery['consumer'] = consumer;
            }
            if (user.type === UserType.producer) {
                const producer = await Producer.findOne({where: {user: user}});
                newQuery['producer'] = producer;
            }
            return await Gig.find({where: newQuery, take: first, skip: offset, relations: ['job', 'producer', 'consumer', 'address']})

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
        let newQuery = {};
        const user = await GigUser.findOne(query.userId);
        if (user.type === UserType.consumer) {
            const consumer = await Consumer.findOne({where: {user: user}});
            newQuery['consumer'] = consumer;
        }
        if (user.type === UserType.producer) {
            const producer = await Producer.findOne({where: {user: user}});
            newQuery['producer'] = producer;
        }
        newQuery['status'] = Not('cancelled');
        return await Gig.find({
            where: newQuery, 
            take: first, 
            skip: offset, 
            relations: ['job', 'producer', 'consumer', 'address'], 
            order: {date: 'DESC'}
        });
    }

    @FieldResolver(() => [GigUser])
    async members(@Root() gig: Gig) {
        let members : GigUser[] = [];
        if (gig.producer) {
            const producer = await Producer.findOne({where: {id: gig.producer.id}, relations: ['user']});
            const firstMember = await GigUser.findOne(producer.user.id);
            if (firstMember) members.push(firstMember)
        }
        if (gig.consumer) {
            const consumer = await Consumer.findOne({where: {id: gig.consumer.id}, relations: ['user']});
            const secondMember = await GigUser.findOne(consumer.user.id);
            if (secondMember) members.push(secondMember)
        }
        return members;
    };

    // Add Gig
    @Mutation(() => Gig)
    async createGig(@Arg('input') input: GigQuery): Promise<Gig> {
        try {
            const job = await Job.findOne(input.jobId);
            const user = await GigUser.findOne(input.userId)
            const consumer = await Consumer.findOne({where: {user: user}})
            if (!consumer) {
                throw `no Consumer found with userId: ${input.userId}`
            }
            let producer : Producer;
            if (input.producerId) {
                producer = await Producer.findOne(input.producerId);
            }
            const gig = new Gig();
            gig.title = input.title;
            gig.price = input.price;
            gig.status = input.status;
            gig.description = input.description;
            gig.date = input.date;
            gig.job = job;
            gig.consumer = consumer;
            if (producer) gig.producer = producer;
            await gig.save();
            return await Gig.findOne({where: {id: gig.id}, relations: ['job', 'consumer', 'producer', 'address']});
        } catch (error) {
            throw `GigResolver.createGig errored for userId ${input.userId}. Error-Msg: ${error}`;
        }
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
