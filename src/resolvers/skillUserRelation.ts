import { Resolver, InputType, Field, Mutation, Arg, } from 'type-graphql';
import { Category } from '../entity/category';
import { GigUser } from '../entity/gigUser';
import { SkillUserRelation } from '../entity/skillUserRelation';
import { Skill } from '../entity/skill';
import logger from '../logger/logger';


@InputType()
export class SkillUserRelationQuery {
  @Field({nullable: true})
  userId?: number;

  @Field({nullable: true})
  skillId?: number;

  @Field({nullable: true})
  isPersonal?: boolean;
}

@Resolver(of => Category)
export class SkillUserRelationResolver {

  @Mutation(() => Boolean)
  async updateRelation(@Arg('input') input: SkillUserRelationQuery): Promise<Boolean> {
    try {
      logger.info(`SkillUserRelationResolver.updateRelation for userId ${input.userId} and skillId ${input.skillId}`);
      
      const user = await GigUser.findOne(input.userId);
      
      const skill = await Skill.findOne(input.skillId);
      
      if (!input.isPersonal) {
        const relation = await SkillUserRelation.findOne({where: {user: user, skill: skill} });
        if (relation) {
          relation.isPersonal = input.isPersonal;
          await relation.save();
          logger.info(`Successfully deleted skill ${input.skillId} for user ${input.userId}`)
        }
      } else {
        const relation = new SkillUserRelation();
        relation.skill = skill;
        relation.skillId = skill.id;
        relation.userId = input.userId;
        relation.user = user;
        relation.isPersonal = input.isPersonal;
        relation.save();
        logger.info(`Successfully added skill ${input.skillId} for user ${input.userId}`)
      }
      return true;
    } catch (error) {
      throw new Error (`SkillResolver.updateRelation errored. Error-Msg.: ${error}`);
    }
  }
  
  static async getProducersForSkill( query: SkillUserRelationQuery, first: number, offset: number) : Promise<GigUser[]> {
    try {
      if (query.skillId) {
        let producers : GigUser[] = [];
        const relations = await SkillUserRelation.find({where: {skillId: query.skillId}});
        for (const relation of relations) {
          const producer = await GigUser.findOne({where: {id: relation.userId, isConsumer: false}});
          producers.push(producer);
        }
        return producers;
      }
    } catch (error) {
      throw new Error (`SkillResolver.getProducersForSkill errored errored. Error-Msg.: ${error}`);
    }
  }

  static async getSkillsForProducer(userId: number)  {
    try {
      if (userId) {
        let skills : Skill[] = [];
        const user = await GigUser.findOne({where: {id: userId, isConsumer: false}});
        if (!user) {
          throw `SkillUserRelationResolver.getSkillsForProducer errored: no producer found with userId: ${userId}`
        }
        const relations = await SkillUserRelation.find({where: {userId: user.id}});
        for (const relation of relations) {
          const skill = await Skill.findOne({ where: {id: relation.skillId} });
          skills.push(skill);
        }
        return skills;
      }
    } catch (error) {
      throw new Error (`SkillResolver.getSkillsForProducer errored. Error-Msg.: ${error}`);
    }
  }

}
