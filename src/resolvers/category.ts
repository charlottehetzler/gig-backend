import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../entity/gig/category';
import { Job } from '../entity/gig/job';
import { JobResolver } from './job';

@InputType()
export class CategoryQuery {
  @Field()
  name?: string;
}

@Resolver(of => Category)
export class CategoryResolver {
  // Home Screen - All Gigs & Browse Random
  @Query(returns => [Category])
  async getAllCategories (@Arg('take') take?: number, @Arg('skip') skip?: number) : Promise <Category[]> {
    return await Category.find({ take: take, skip: skip});
  }

  @FieldResolver(() => [Job])
  async jobs(@Root() category: Category) {
      return await JobResolver.getAllJobsForUser({ categoryId: category.id }, 0, 0);
  };

  //Add Category
  @Mutation(() => Job)
  async createCategory(@Arg('input') input: CategoryQuery): Promise<Category> {
    const category = new Category();
    category.name = input.name;
    await category.save();
    return category;
  }

}
