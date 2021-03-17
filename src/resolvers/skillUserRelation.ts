import { Resolver, InputType, Field, } from 'type-graphql';
import { Category } from '../entity/category';
import { GigUser } from '../entity/gigUser';
import { SkillUserRelation } from '../entity/skillUserRelation';
import { Skill } from '../entity/skill';


@InputType()
export class SkillUserRelationQuery {
  @Field()
  userId?: number;

  @Field()
  skillId?: number;
}

@Resolver(of => Category)
export class SkillUserRelationResolver {

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
      throw `SkillUserRelationResolver.getProducersForSkill errored: Error-Msg: ${error}`;
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
      throw `SkillUserRelationResolver.getSkillsForProducer errored: Error-Msg: ${error}`;
    }
  }

}
