import { Resolver, Query, Arg, InputType, Field, Mutation, FieldResolver, Root } from 'type-graphql';
import { Job } from '../../entity/gig/job';
import { Producer } from '../../entity/user/producer';
import { Gig } from '../../entity/gig/gig';
import { GigUser } from '../../entity/user/gigUser';
import { Address } from '../../entity/user/address';
import { getRepository, RelationCount } from 'typeorm';
import { Review } from '../../entity/user/review';
import { JobProducerRelation } from '../../entity/gig/jobProducerRelation';

@InputType()
export class AddressQuery {  
    @Field({ nullable: true })
    addressId: number;

    @Field({ nullable: true })
    streetRoadName: string;

    @Field({ nullable: true })
    houseNumber: string;

    @Field({ nullable: true })
    apartmentSuiteNo: string;

    @Field({ nullable: true })
    zipPostalCode: string;

    @Field({ nullable: true })
    cityTownVillageLocality: string;

    @Field({ nullable: true })
    stateCounty: string;

    @Field({ nullable: true })
    region: string;

    @Field({ nullable: true })
    country: string;

    @Field({ nullable: true })
    note: string;

    @Field({ nullable: true })
    userId: number;
}


@Resolver()
export class AddressResolver {
    @Mutation(() => Address)
    async updateAddress(@Arg('input') input: AddressQuery): Promise<Address> {
        let data = (input as unknown) as Address;
        
        let query: any = undefined;
        if(input.addressId) query = { gigId: input.addressId };
        if(query !== undefined) {
            const existing = await getRepository(Address).findOne(query);
            if (existing) {
                const tmp: any = {
                    ...existing,
                    ...input
                };
                data = tmp as Address;
            }
        }
        const address = await getRepository(Address).save(data);
        return address;
    }
}
