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

  @Field({nullable: true})
  isPersonal?: boolean;
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
      throw new Error (`SkillResolver.getAllSkills errored. Error-Msg.: ${error}`);
    }
  }

  @Query(returns =>Skill)
  async getOneSkill (@Arg('query', () => SkillQuery) query: SkillQuery) : Promise <Skill> {
    try {
      return await Skill.findOne(query.skillId);
    } catch (error) {
      throw new Error (`SkillResolver.getOneskill errored. Error-Msg.: ${error}`);
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
      throw new Error (`SkillResolver.getAllSkillsForProducerOrCategory errored. Error-Msg.: ${error}`);
    }
  }

  @Query(returns => [Skill])
  async getAllSkillsForProducer (@Arg('query', () => SkillQuery) query: SkillQuery) : Promise <Skill[]> {
    try {
      return await SkillUserRelationResolver.getSkillsForProducer(query.userId)
    } catch (error) {
      throw new Error (`SkillResolver.getAllSkillsForProducer errored. Error-Msg.: ${error}`);
    }
  }

  @Query(returns => [Skill])
  async getAvailableSkillsForProducer (@Arg('query', () => SkillQuery) query: SkillQuery) : Promise <Skill[]> {
    try {
      let userSkills: Skill[] = [];
      let availableSkills: Skill[] = [];
      
      const user = await GigUser.findOne(query.userId);
      if (!user) throw `SkillResolver.getAvailableSkillsForProducer errored: Couldn't find user with id ${query.userId}`;
      
      const relations = await SkillUserRelation.find({ where: {user: user, isPersonal: true}});
      for (const relation of relations) {
        const skill = await Skill.findOne(relation.skillId);
        userSkills.push(skill);
      }

      const allSkills = await Skill.find();
      for (const skill of allSkills) {
        for (const userSkill of userSkills) {
          if (skill.id !== userSkill.id) {
            availableSkills.push(skill);
          }
        }
      }
      return availableSkills;
    } catch (error) {
      throw new Error (`SkillResolver.getAllSkillsForProducer errored. Error-Msg.: ${error}`);
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


  @Mutation(() => Skill)
  async addSkill(@Arg('input') input: SkillQuery): Promise<Skill> {
    try {
      logger.info(`adding skill for user ${input.userId} and skill ${input.name}`)
      
      const user = await GigUser.findOne(input.userId);
      
      const category = await Category.findOne(input.categoryId);
      if (!category) throw `SkillResolver.addSkill errored: Couldn't find category with id ${input.categoryId}`;

      const skill = new Skill();
      skill.name = input.name;
      skill.category = category;
      if(input.description) skill.description = input.description;
      const newSkill = await skill.save();

      const relation = new SkillUserRelation();
      relation.skill = newSkill;
      relation.skillId = newSkill.id;
      relation.userId = input.userId;
      relation.user = user;
      relation.isPersonal = input.isPersonal;

      await relation.save();
      
      logger.info(`Successfull created new Skill ${newSkill.name, newSkill.id}`)
      return newSkill;

    } catch (error) {
      throw new Error (`SkillResolver.addSkill errored. Error-Msg.: ${error}`);
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
      throw new Error (`SkillResolver.getAllSkillsForUser errored. Error-Msg.: ${error}`);
    }
  }

}
