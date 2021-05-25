import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../entity/category';
import { Deal } from '../entity/deal';
import { GigUser } from '../entity/gigUser';
import { Skill } from '../entity/skill';
import { getRepository } from 'typeorm';

@InputType()
export class DealInput {
    @Field({nullable: true})
    dealId: number;

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

}

@Resolver(of => Deal)
export class DealResolver {

    @Query(returns => [Deal])
    async getAllDeals (
        @Arg('first', { defaultValue: 10 }) first: number = 10,
        @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Deal[]> {
        try {
            return await Deal.find({ take: first, skip: offset, relations: ['skill', 'category', 'user']});
        } catch (error) {
            throw new Error (`DealResolver.getAllDeals errored. Error-Msg.: ${error}`);
        }
    }
    @Query(returns => [Deal])
    async getAllDealsForProducer (
        @Arg('userId') userId: number
    ) : Promise <Deal[]> {
        try {
            const user = await GigUser.findOne({ where: {id: userId, isConsumer: false }});
            if (!user) throw new Error (`DealResolver.getAllDealsForProducer errord. No user found with id ${userId}`);
        
            return await Deal.find({where: { user: user }, relations: ['skill', 'category', 'user']});
        } catch (error) {
            throw new Error (`DealResolver.getAllDealsForProducer errored. Error-Msg.: ${error}`);
        }
    }

    @Mutation(() => Deal)
    async createDeal(@Arg('input') input: DealInput): Promise<Deal> {
        try {
            const user = await GigUser.findOne({ where: {id: input.userId, isConsumer: false } });
            if (!user) throw new Error (`DealResolver.getAllDealsForProducer errord. No user found with id ${input.userId}`);
            
            const skill = await Skill.findOne(input.skillId);
            if (!skill) throw new Error (`DealResolver.getAllDealsForProducer errord. No user found with id ${input.skillId}`);
            
            const category = await Category.findOne(input.categoryId);
            if (!category) throw new Error (`DealResolver.getAllDealsForProducer errord. No user found with id ${input.categoryId}`);

            const deal = new Deal();
            deal.title = input.title;
            deal.description = input.description;
            deal.fromDate = input.fromDate;
            if (input.toDate) deal.toDate = input.toDate;
            deal.user = user;
            deal.skill = skill;
            deal.category = category;
            await deal.save();

            return deal;
        } catch (error) {
            throw new Error (`DealResolver.createDeal errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(() => Boolean)
    async closeDeal(@Arg('dealId') dealId: number): Promise<Boolean> {
        try {
            const deal = await Deal.findOne(dealId);
            deal.isClosed = true;
            await deal.save();
            return true;
        } catch (error) {
            throw new Error (`DealResolver.closeDeal errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(() => Deal)
    async updateDeal(@Arg('input') input: DealInput): Promise<Deal> {
        try {
            let data = (input as unknown) as Deal;
            let query: any = undefined;
            if (input.userId) query = { id: input.dealId };
            if (query !== undefined) {
                const existing = await getRepository(Deal).findOne(query);
                if (existing) {
                    const tmp: any = {
                        ...existing,
                        ...input
                    };
                    data = tmp as Deal;
                }
            }
            const deal = await getRepository(Deal).save(data);
            return deal;
        } catch (error) {
            throw new Error (`DealResolver.updateDeal errored. Error-Msg.: ${error}`);      
        }
    }

}
