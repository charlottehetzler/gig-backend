import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../entity/category';
import { Skill } from '../entity/skill';
import { SkillUserRelation } from '../entity/skillUserRelation';
import logger from '../logger/logger';
import { GigUser } from '../entity/gigUser';
import { SkillUserRelationResolver } from './skillUserRelation';

@InputType()
export class SkillQuery {
  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  skillId?: number;
  
  @Field({ nullable: true })
  userId?: number;

  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  description?: string;
}

@Resolver(of => Skill)
export class SkillResolver {

  @Query(returns => [Skill])
  async getAllSkills (
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
  ) : Promise <Skill[]> {
    try {
      return await Skill.find({take: first, skip: offset});
    } catch (error) {
      throw `SkillResolver.getAllSkills errored: Error-Msg: ${error}`
    }
  }

  @Query(returns =>Skill)
  async getOneSkill (@Arg('query', () => SkillQuery) query: SkillQuery) : Promise <Skill> {
    try {
      return await Skill.findOne(query.skillId);
    } catch (error) {
      throw `SkillResolver.getOneskill errored: Error-Msg: ${error}`
    }
  }

  @Query(returns => [Skill])
  async getAllSkillsForProducerOrCategory (
    @Arg('query', () => SkillQuery) query: SkillQuery,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <Skill[]> {
    try {
      let newQuery = {};
      if (query.categoryId) {
        const category = await Category.findOne(query.categoryId);
        newQuery['category'] = category;
      }
      if (query.userId) {
        const user = await GigUser.findOne({where: {isConsumer: false, id: query.userId}});
        if (user) {
          const skillUserRelation = await SkillUserRelation.findOne({where: {user: user}});
          newQuery['user'] = skillUserRelation.userId;
        } else {
          throw `SkillResolver.getAllSkillsForProducerOrCategory errored: No producer found with userId: ${query.userId}`;
        }
      }
      return await Skill.find({ where: newQuery, take: first, skip: offset, relations: ['category']});
    } catch (error) {
      throw `SkillResolver.getAllSkillsForProducerOrCategory errored: Error-Msg: ${error}`
    }
  }

  @Query(returns => [Skill])
  async getAllSkillsForProducer (@Arg('query', () => SkillQuery) query: SkillQuery) : Promise <Skill[]> {
    try {
      return await SkillUserRelationResolver.getSkillsForProducer(query.userId)
    } catch (error) {
      throw `SkillResolver.getAllSkillsForProducer errored: Error-Msg: ${error}`
    }
  }

  @FieldResolver(() => [SkillUserRelation])
  async producers(@Root() skill: Skill) {
    return await SkillUserRelationResolver.getProducersForSkill({ skillId: skill.id }, 0, 0);
  };

  @FieldResolver(() => Category)
  async category(@Root() skill: Skill) {
    return await Category.findOne(skill.category)
  };

  // Add Skill
  @Mutation(() => Skill)
  async addSkill(@Arg('input') input: SkillQuery): Promise<Skill> {
    try {
      logger.info(`adding skill for user ${input.userId} and skill ${input.name}`)
      
      const user = await GigUser.findOne(input.userId);
      
      const category = await Category.findOne(input.categoryId);
      const skill = new Skill();
      skill.name = input.name;
      skill.category = category
      const newSkill = await skill.save();
      
      const relation = new SkillUserRelation();
      relation.skill = newSkill;
      relation.skillId = newSkill.id;
      relation.userId = input.userId;
      relation.user = user;
      await relation.save();
      
      logger.info(`Successfull created new Skill ${newSkill.name, newSkill.id}`)
      return newSkill;

    } catch (error) {
      throw `SkillResolver.addSkill errored: Error-Msg: ${error}`
    }
  }

  @Mutation(() => Boolean)
  async deleteSkill(@Arg('input') input: SkillQuery): Promise<Boolean> {
    try {
      logger.info(`deleting skill for user ${input.userId} and skill ${input.name}`)
      
      const user = await GigUser.findOne(input.userId);
      const skill = await Skill.findOne(input.skillId);

      const relation = await SkillUserRelation.findOne({where: {user: user, skill: skill} });
      relation.isPersonal = false;
      await relation.save();
      
      logger.info(`Successfull deleted skill ${input.skillId} for user ${input.userId}`)
      return true;

    } catch (error) {
      throw `SkillResolver.deleteSkill errored: Error-Msg: ${error}`
    }
  }

  static async getAllSkillsForUser (query: SkillQuery, first: number, offset: number) : Promise<Skill[]> {
    try {
      let newQuery = {};
      if (query.categoryId) {
        const category = await Category.findOne(query.categoryId);
        newQuery['category'] = category;
      }
      if (query.userId) {
        const user = await GigUser.findOne({where: {id: query.userId, isConsumer: false}});
        newQuery['user'] = user;
      }
      return await Skill.find({ where: newQuery, take: first, skip: offset, relations: ['category', 'user']});

    } catch (error) {
      throw `errored: Error-Msg: ${error}`;
    }
  }

}
