import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { GigUser } from '../entity/gigUser';
import { Language } from '../entity/language';
import { LanguageUserRelation } from '../entity/languageUserRelation';
import { Not, getManager } from 'typeorm';

@InputType()
export class LanguageId {
    @Field({ nullable: true })
    languageId?: number;
}

@InputType()
export class LanguageQuery {
    @Field({ nullable: true })
    userId?: number;

    // @Field({ nullable: true})
    // languageIds?: LanguageId[];

    @Field({ nullable: true })
    isActive?: boolean;
}


@Resolver(of => Language)
export class LanguageResolver {

    @Query(returns => [Language])
    async getAllLanguages () : Promise <Language[]> {
        try {
            return await Language.find();
        } catch (error) {
            throw new Error (`LanguageResolver.getAllLanguages errored. Error-Msg.: ${error}`);      
        }
    }

    @Query(returns => [Language])
    async getAllAvailableLanguagesForUser (
        @Arg('query', () => LanguageQuery) query: LanguageQuery
    ) : Promise <Language[]> {
        try {
            let userLanguages: number[] = []
            
            const user = await GigUser.findOne(query.userId);
            if (!user) throw `LanguageResolver.getAllAvailableLanguagesForUser  errored: Couldn't find user with id ${query.userId}`;

            const nativeLanguage = await Language.findOne({where: {name: user.nativeLanguage}});

            const relations = await LanguageUserRelation.find({where: {userId: user.id, isActive: true} });
            
            for (const relation of relations) {
                const language = await Language.findOne({ where: {id: relation.languageId}});
                userLanguages.push(language.id);
            }
            
            const availableLanguages = await getManager()
                .createQueryBuilder(Language, 'language')
                .where("language.id NOT IN (" + userLanguages + ")")
                .andWhere("language.id != :id", {id: nativeLanguage.id})
                .getMany();

            
            return availableLanguages;
        } catch (error) {
            throw new Error (`LanguageResolver.getAllAvailableLanguagesForUser errored. Error-Msg.: ${error}`);      
        }
    }

    @Query(returns => [Language])
    async getAllLanguagesForUser (
        @Arg('query', () => LanguageQuery) query: LanguageQuery
    ) : Promise <Language[]> {
        try {
            let languages: Language[] = []
            
            const user = await GigUser.findOne(query.userId);
            
            const nativeLanguage = await Language.findOne({where: {name: user.nativeLanguage}});
            
            const relations = await LanguageUserRelation.find({where: {userId: user.id, languageId: Not(nativeLanguage.id), isActive: true} });
            
            for (const relation of relations) {
                const language = await Language.findOne(relation.languageId);
                languages.push(language);
            }

            return languages;
        } catch (error) {
            throw new Error (`LanguageResolver.getAllLanguagesForUser errored. Error-Msg.: ${error}`);      
        }
    }

    @Mutation(returns => Boolean)
    async addOrUpdateLanguageForUser (
        @Arg('userId') userId: number,
        @Arg('languageIds', type => [Number]) languagesIds: number[],
        @Arg('isActive') isActive: boolean,
    ) : Promise <Boolean> {
        try {
            const user = await GigUser.findOne(userId);

            const nativeLanguage = await Language.findOne({where: {name: user.nativeLanguage} });
            for (const langId of languagesIds) {
                
                const language = await Language.findOne(langId);

                if (language === nativeLanguage) {
                    throw new Error(`LanguageResolver.addOrUpdateLanguageForUser cannot add nativeLanguage as additional Language`);
                }

                const relation = await LanguageUserRelation.findOne({ where: {user: user, language: language} });

                if (relation) {
                    relation.isActive = isActive;
                    await relation.save();
                } else {
                    const relation = new LanguageUserRelation ();
                    relation.user = user;
                    relation.userId = user.id;
                    relation.language = language;
                    relation.languageId = language.id
                    relation.isActive = isActive;
                    await relation.save();
                }
            }
            return true;
        } catch (error) {
            throw new Error (`LanguageResolver.addOrUpdateLanguageForUser errored. Error-Msg.: ${error}`);      
        }
    }
}
