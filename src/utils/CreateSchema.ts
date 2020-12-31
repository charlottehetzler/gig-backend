import { buildSchemaSync, createResolversMap } from 'type-graphql';
import { gql } from 'apollo-server-core';
import { printSchema, buildFederatedSchema } from '@apollo/federation';
import { GigResolver } from '../resolvers/gig/gig';
import { CategoryResolver } from '../resolvers/gig/category';
import { PaymentResolver } from '../resolvers/payment/payment';
import { UserResolver } from '../resolvers/user/user';
import { JobResolver } from '../resolvers/gig/job';
import { ProducerResolver } from '../resolvers/user/producer';
import { ReviewResolver } from '../resolvers/user/review';
import { AddressResolver } from '../resolvers/user/address';

export const compiledSchema = buildSchemaSync({
    resolvers: [ 
        CategoryResolver, 
        GigResolver, 
        JobResolver,
        PaymentResolver, 
        UserResolver, 
        ProducerResolver,
        ReviewResolver,
        AddressResolver 
    ]
});

export const schema = buildFederatedSchema({
    typeDefs: gql(printSchema(compiledSchema)),
    resolvers: createResolversMap(compiledSchema) as any
});