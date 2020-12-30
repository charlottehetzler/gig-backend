import { buildSchemaSync, createResolversMap } from 'type-graphql';
import { gql } from 'apollo-server-core';
import { printSchema, buildFederatedSchema } from '@apollo/federation';
import { GigResolver } from '../resolvers/gig';
import { CategoryResolver } from '../resolvers/category';
import { PaymentResolver } from '../resolvers/payment';
import { UserResolver } from '../resolvers/user';
import { JobResolver } from '../resolvers/job';

export const compiledSchema = buildSchemaSync({
    resolvers: [ GigResolver, CategoryResolver, PaymentResolver, UserResolver, JobResolver ]
});

export const schema = buildFederatedSchema({
    typeDefs: gql(printSchema(compiledSchema)),
    resolvers: createResolversMap(compiledSchema) as any
});