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
import { FriendResolver } from '../resolvers/friend';
import { LanguageResolver } from '../resolvers/language';
import { DealResolver } from '../resolvers/deal';
import { AuthResolver } from '../resolvers/auth';

export const compiledSchema = buildSchemaSync({
    resolvers: [ 
        CategoryResolver,
        ChatRoomResolver,
        MessageResolver,
        SkillResolver,
        SkillUserRelationResolver,
        ReviewResolver,
        UserResolver,
        FriendResolver, 
        LanguageResolver, 
        DealResolver, 
        AuthResolver
    ]
});

export const schema = buildFederatedSchema({
    typeDefs: gql(printSchema(compiledSchema)),
    resolvers: createResolversMap(compiledSchema) as any
});