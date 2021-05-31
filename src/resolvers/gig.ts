import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../entity/category';
import { Gig } from '../entity/gig';
import { GigUser } from '../entity/gigUser';
import { Skill } from '../entity/skill';
import { getRepository } from 'typeorm';

@InputType()
export class GigInput {
    @Field({nullable: true})
    gigId: number;

    @Field({nullable: false})
    userId: number;

    @Field({nullable: false})
    title: string;

    @Field({nullable: false})
    description: string;

    @Field({nullable: false})
    fromDate: Date;

    @Field({nullable: true})
    toDate: Date;

    @Field({nullable: false})
    skillId: number;

    @Field({nullable: false})
    categoryId: number;

    @Field({nullable: true})
    isClosed: boolean;

    @Field({nullable: true })
    isAd: boolean;

}

@Resolver(of => Gig)
export class GigResolver {

    @Query(returns => [Gig])
    async getAllGigs (
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
        @Arg('isAd') isAd: boolean,
    ) : Promise <Gig[]> {
        try {
            return await Gig.find({ 
                where: { isAd: isAd }, 
                take: first, 
                skip: offset, 
                relations: ['skill', 'category', 'user']
            });
        } catch (error) {
            throw new Error (`GigResolver.getAllGigs errored. Error-Msg.: ${error}`);
        }
    }

    @Query(returns => [Gig])
    async getAllDealsForProducer (
        @Arg('userId') userId: number
    ) : Promise <Gig[]> {
        try {
            const user = await GigUser.findOne({ where: {id: userId, isConsumer: false }});
            if (!user) throw new Error (`GigResolver.getAllDealsForProducer errord. No user found with id ${userId}`);
        
            return await Gig.find({
                where: { user: user, isAd: true }, 
                relations: ['skill', 'category', 'user']
            });
        } catch (error) {
            throw new Error (`GigResolver.getAllDealsForProducer errored. Error-Msg.: ${error}`);
        }
    }

    @Query(returns => [Gig])
    async getAllGigsForConsumer (
        @Arg('userId') userId: number
    ) : Promise <Gig[]> {
        try {
            const user = await GigUser.findOne({ where: { id: userId, isConsumer: true }});
            if (!user) throw new Error (`GigResolver.getAllGigsForConsumer errord. No user found with id ${userId}`);
        
            return await Gig.find({
                where: { user: user, isAd: false }, 
                relations: ['skill', 'category', 'user']
            });

        } catch (error) {
            throw new Error (`GigResolver.getAllGigsForConsumer errored. Error-Msg.: ${error}`);
        }
    }

    @Mutation(() => Gig)
    async createGig(@Arg('input') input: GigInput): Promise<Gig> {
        try {
            const user = await GigUser.findOne({ where: {id: input.userId, isConsumer: false } });
            if (!user) throw new Error (`GigResolver.getAllDealsForProducer errord. No user found with id ${input.userId}`);
            
            const skill = await Skill.findOne(input.skillId);
            if (!skill) throw new Error (`GigResolver.getAllDealsForProducer errord. No user found with id ${input.skillId}`);
            
            const category = await Category.findOne(input.categoryId);
            if (!category) throw new Error (`GigResolver.getAllDealsForProducer errord. No user found with id ${input.categoryId}`);

            const gig = new Gig();
            gig.title = input.title;
            gig.description = input.description;
            gig.fromDate = input.fromDate;
            if (input.toDate) gig.toDate = input.toDate;
            gig.user = user;
            gig.skill = skill;
            gig.category = category;
            gig.isAd = input.isAd;
            await gig.save();

            return gig;
        } catch (error) {
            throw new Error (`GigResolver.createDeal errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(() => Boolean)
    async closeGig(@Arg('gigId') gigId: number): Promise<Boolean> {
        try {
            const gig = await Gig.findOne(gigId);
            gig.isClosed = true;
            await gig.save();
            return true;
        } catch (error) {
            throw new Error (`GigResolver.closeDeal errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(() => Gig)
    async updateDeal(@Arg('input') input: GigInput): Promise<Gig> {
        try {
            let data = (input as unknown) as Gig;
            let query: any = undefined;
            if (input.userId) query = { id: input.gigId };
            if (query !== undefined) {
                const existing = await getRepository(Gig).findOne(query);
                if (existing) {
                    const tmp: any = {
                        ...existing,
                        ...input
                    };
                    data = tmp as Gig;
                }
            }
            const gig = await getRepository(Gig).save(data);
            return gig;
        } catch (error) {
            throw new Error (`GigResolver.updateDeal errored. Error-Msg.: ${error}`);      
        }
    }

}
