import { Resolver, FieldResolver, Root } from 'type-graphql';
import { GigUser } from '../../entity/user/gigUser';
import { Consumer } from '../../entity/user/consumer';

@Resolver(of => Consumer)
export class ConsumerResolver {
    @FieldResolver(() => GigUser)
    async user(@Root() consumer: Consumer) {
        console.log(consumer)
        return await GigUser.findOne(consumer.user);
    };
}
