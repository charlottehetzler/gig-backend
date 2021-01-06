import { buildSchemaSync, createResolversMap, AuthChecker } from 'type-graphql';
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
import { MessageResolver } from '../resolvers/chat/message';
import { ChatRoomResolver } from '../resolvers/chat/chatRoom';
import { AuthResolver } from '../resolvers/user/auth';
import { authChecker } from '../middleware/authChecker';


export const compiledSchema = buildSchemaSync({
    resolvers: [ 
        CategoryResolver, 
        GigResolver, 
        JobResolver,
        PaymentResolver, 
        UserResolver, 
        ProducerResolver,
        ReviewResolver,
        AddressResolver,
        MessageResolver,
        ChatRoomResolver,
        AuthResolver
    ]
});

export const schema = buildFederatedSchema({
    typeDefs: gql(printSchema(compiledSchema)),
    resolvers: createResolversMap(compiledSchema) as any
});