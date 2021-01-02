import { Resolver, Query, Arg, FieldResolver, Root, InputType, Field, Mutation } from 'type-graphql';
import { Category } from '../../entity/gig/category';
import { Job } from '../../entity/gig/job';
import { JobResolver } from './job';

@InputType()
export class CategoryQuery {
  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  categoryId?: number;

  @Field({nullable: true})
  jobId?: number;
}

@Resolver(of => Category)
export class CategoryResolver {

  // Home Screen - All Gigs & Browse Random
  @Query(returns => [Category])
  async getAllCategories (
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
  ) : Promise <Category[]> {
    return await Category.find({ take: first, skip: offset});
  }

  @Query(returns => Category)
  async getCategoryForJob (@Arg('query') query: CategoryQuery) : Promise <Category> {
    const job = await Job.findOne({where: {id: query.jobId}, relations: ['category']});
    return await Category.findOne(job.category.id);
  }

  @FieldResolver(() => [Job])
  async jobs(@Root() category: Category) {
    return await JobResolver.getAllJobsForUser({ categoryId: category.id }, 0, 0);
  };

  @FieldResolver(() => [Job])
  async categoryJobs(@Root() category: Category) {
    return await Job.find({where: {category: category}})
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
