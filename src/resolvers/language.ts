import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { GigUser } from '../entity/gigUser';
import { Language } from '../entity/language';
import { LanguageUserRelation } from '../entity/languageUserRelation';
import { Not } from 'typeorm';

@InputType()
export class LanguageQuery {
    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    languageId?: number;

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
            let userLanguages: Language[] = []
            
            const user = await GigUser.findOne(query.userId);
            
            const nativeLanguage = await Language.findOne({where: {name: user.nativeLanguage}});
            
            let availableLanguages: Language[] = []
            
            const allLanguages = await Language.find({where: {id: Not(nativeLanguage.id)}});

            const relations = await LanguageUserRelation.find({where: {userId: user.id} });
            
            for (const relation of relations) {
                const language = await Language.findOne({ where: {id: relation.languageId}});
                userLanguages.push(language);
            }
            
            for (const language of allLanguages) {
                for (const userLanguage of userLanguages) {
                    if (language.id !== userLanguage.id) {
                        availableLanguages.push(language);
                    }
                }
            }

            const availableLanguagesUnique = availableLanguages.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            })
            
            return availableLanguagesUnique;
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
            
            const relations = await LanguageUserRelation.find({where: {userId: user.id, languageId: Not(nativeLanguage.id)} });
            
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
        @Arg('input', () => LanguageQuery) input: LanguageQuery
    ) : Promise <Boolean> {
        try {
            const user = await GigUser.findOne(input.userId);

            const language = await Language.findOne(input.languageId);

            const nativeLanguage = await Language.findOne({where: {name: user.nativeLanguage} });
            
            if (language === nativeLanguage) {
                throw new Error(`LanguageResolver.addOrUpdateLanguageForUser cannot add nativeLanguage as additional Language`);
            }

            const relation = await LanguageUserRelation.findOne({ where: {user: user, language: language} });
                
            if (relation) {
                relation.isActive = input.isActive;
                await relation.save();
            } else {
                const relation = new LanguageUserRelation ();
                relation.user = user;
                relation.userId = user.id;
                relation.language = language;
                relation.languageId = language.id
                relation.isActive = input.isActive;
                await relation.save();
            }
            
            return true;
        } catch (error) {
            throw new Error (`LanguageResolver.addOrUpdateLanguageForUser errored. Error-Msg.: ${error}`);      
        }
    }
}
