import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../entity/category';
import { Skill } from '../entity/skill';
import { SkillResolver } from './skill';

@InputType()
export class CategoryQuery {
  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  categoryId?: number;

  @Field({nullable: true})
  skillId?: number;
}

@Resolver(of => Category)
export class CategoryResolver {

  // Home Screen - All Gigs & Browse Random
  @Query(returns => [Category])
  async getAllCategories (
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
  ) : Promise <Category[]> {
    try {
      return await Category.find({ take: first, skip: offset, relations: ['skills']});
    } catch (error) {
      throw new Error (`CategoryResolver.getAllCategories errored. Error-Msg.: ${error}`);
    }
  }

  @Query(returns => Category)
  async getCategoryForSkill (@Arg('query') query: CategoryQuery) : Promise <Category> {
    try {
      const skill = await Skill.findOne({where: {id: query.skillId}, relations: ['category']});
      return await Category.findOne(skill.category.id);
    } catch (error) {
      throw new Error (`CategoryResolver.getCategoryForSkill errored. Error-Msg.: ${error}`);
    }
  }

  @FieldResolver(() => [Skill])
  async skills(@Root() category: Category) {
    return await SkillResolver.getAllSkillsForUser({ categoryId: category.id }, 0, 0);
  };

  @FieldResolver(() => [Skill])
  async categorySkills(@Root() category: Category) {
    return await Skill.find({where: {category: category}})
  };

  @Mutation(() => Category)
  async createCategory(@Arg('input') input: CategoryQuery): Promise<Category> {
    try {
      const category = new Category();
      category.name = input.name;
      await category.save();
      return category;
    } catch (error) {
      throw new Error (`CategoryResolver.createCategory errored. Error-Msg.: ${error}`);      
    }
  }
}
