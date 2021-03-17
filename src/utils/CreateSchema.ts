import { buildSchemaSync, createResolversMap, AuthChecker } from 'type-graphql';
import { gql } from 'apollo-server-core';
import { printSchema, buildFederatedSchema } from '@apollo/federation';
import { CategoryResolver } from '../resolvers/category';
import { UserResolver } from '../resolvers/user';
import { MessageResolver } from '../resolvers/message';
import { ChatRoomResolver } from '../resolvers/chatRoom';
import { SkillResolver } from '../resolvers/skill';
import { SkillUserRelationResolver } from '../resolvers/skillUserRelation';
import { ReviewResolver } from '../resolvers/review';


export const compiledSchema = buildSchemaSync({
    resolvers: [ 
        CategoryResolver,
        ChatRoomResolver,
        MessageResolver,
        SkillResolver,
        SkillUserRelationResolver,
        ReviewResolver,
        UserResolver, 
    ]
});

export const schema = buildFederatedSchema({
    typeDefs: gql(printSchema(compiledSchema)),
    resolvers: createResolversMap(compiledSchema) as any
});