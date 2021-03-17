import { buildSchemaSync, createResolversMap, AuthChecker } from 'type-graphql';
import { gql } from 'apollo-server-core';
import { printSchema, buildFederatedSchema } from '@apollo/federation';
import { CategoryResolver } from '../resolvers/category';
import { UserResolver } from '../resolvers/user';
import { MessageResolver } from '../resolvers/message';
import { ChatRoomResolver } from '../resolvers/chatRoom';


export const compiledSchema = buildSchemaSync({
    resolvers: [ 
        CategoryResolver, 
        UserResolver, 
        MessageResolver,
        ChatRoomResolver,
    ]
});

export const schema = buildFederatedSchema({
    typeDefs: gql(printSchema(compiledSchema)),
    resolvers: createResolversMap(compiledSchema) as any
});