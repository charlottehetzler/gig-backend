import { GigUser, UserType } from "../../entity/user/gigUser";
import { Mutation, Arg, Resolver, Field, InputType, ObjectType, Query } from "type-graphql";
import { IsEmail } from "class-validator";
import logger from "../../logger/logger";
import bcrypt from "bcrypt";
import { Producer } from "../../entity/user/producer";
import { Consumer } from "../../entity/user/consumer";
var jwt = require('jsonwebtoken');

@InputType()
export class LoginInput {
    @Field({ nullable: false })
    @IsEmail()
    email: string;

    @Field({ nullable: false })
    password: string;
}

@InputType()
export class SignupInput extends LoginInput {
    @Field({ nullable: false })
    firstName: string;

    @Field({ nullable: false })
    lastName: string;

    @Field({ nullable: true })
    birthday: Date;
}

@InputType()
export class UpdateInput {
    @Field({ nullable: false })
    userId: number;

    @Field({ nullable: false })
    type: UserType;
}

@ObjectType()
export class AuthData {
    @Field({ nullable: false })
    userId: number;

    @Field({ nullable: true })
    token: string;

    @Field({ nullable: true })
    isAuth: boolean;

    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    userType: UserType;
}

const maxLoginAttempts: number = 5;
const tokenTemplate = '{token}';

@Resolver(of => GigUser)
export class AuthResolver {
    private static saltRounds = 10;

    @Mutation(returns => AuthData)
    async userSignup( @Arg('input') input: SignupInput): Promise<AuthData> {
        logger.info(`begin customer sign up: ${input.email}`);

        const existingUser = await GigUser.findOne({ email: input.email });
        if (existingUser) {
            logger.info(`email ${input.email} is already taken`);
            throw new Error(`email ${input.email} is already taken`);
        }
        let user = new GigUser();
        user.email = input.email;
        user.firstName = input.firstName;
        user.lastName = input.lastName;
        if (input.birthday) user.birthday = input.birthday;
        user.hashedPassword = await this.hashPassword(input.password);
        user = await GigUser.save(user);

        const token =  await jwt.sign({userId: user.id, email: user.email}, 'supersecretsauce');

        logger.info(`user sign up successful, email:${input.email}`);

        const authData = new AuthData();
        authData.userId = user.id;
        authData.token = token;
        authData.isAuth = true;
        authData.firstName = user.firstName;
        authData.lastName = user.lastName;
        authData.userType = user.type;
        return authData;
    }

    @Mutation(returns => AuthData)
    async userLogin( @Arg('input') input: LoginInput) : Promise <AuthData> {
        logger.info(`authenticating ${input.email}`);
        let user = await GigUser.findOne({ where: { email: input.email }});

        if (!user) {
            logger.info(`customer not found: ${input.email}`);
            throw `Authentication Error: invalid user`;
        }

        // if (user.loginAttempts >= maxLoginAttempts) {
        //     throw `Authentication Error: maximum login attempts reached`;
        // }

        const validPassword = await this.checkPassword(input.password, user.hashedPassword);
        if (!validPassword) {
            logger.info(`invalid password: ${input.email}`);
            await this.incrementLoginAttempt(user);
            throw `Authentication Error: invalid password`;
        }
        user = await this.resetLoginAttempt(user)
        const token =  await jwt.sign({userId: user.id, email: user.email}, 'supersecretsauce');
        logger.info(`${input.email} authenticated successfully`);

        const authData = new AuthData();
        authData.userId = user.id;
        authData.token = token;
        authData.isAuth = true;
        authData.firstName = user.firstName;
        authData.lastName = user.lastName;
        return authData;
    }

    @Mutation(returns => AuthData)
    async userUpdate( @Arg('input') input: UpdateInput) : Promise <AuthData> {
        logger.info(`updating user ${input.userId}`);
        let user = await GigUser.findOne(input.userId);

        if (!user) {
            logger.info(`customer not found: ${input.userId}`);
            throw `Authentication Error: couldn't find user`;
        }

        if (input.type === UserType.producer) {
            const producer = await Producer.findOne({where: {user: user}}); 
            if (producer) {
                user.type = UserType.producer
                await user.save();
            } else {
                const newProducer = new Producer();
                newProducer.user = user;
                await newProducer.save();
                user.type = UserType.producer
                user.producer = newProducer;
                await user.save()
            }
        } else {
            const consumer = await Consumer.findOne({where: {user: user}});
            if (consumer) {
                user.type = UserType.consumer
                await user.save();
            } else {
                const newConsumer = new Consumer();
                newConsumer.user = user;
                await newConsumer.save();
                user.type = UserType.consumer;
                user.consumer = newConsumer;
                await user.save();
            }
        }

        const token =  await jwt.sign({userId: user.id, email: user.email}, 'supersecretsauce');
        logger.info(`user ${input.userId} updated successfully`);

        const authData = new AuthData();
        authData.userId = user.id;
        authData.token = token;
        authData.isAuth = true;
        authData.firstName = user.firstName;
        authData.lastName = user.lastName;
        authData.userType = user.type;
        return authData;
    }


    async hashPassword(pwd: string): Promise<string> {
        return await bcrypt.hash(pwd, AuthResolver.saltRounds);
    }

    async checkPassword(pwd: string, pwdhash: string): Promise<boolean> {
        return await bcrypt.compare(pwd, pwdhash);
    }

    async incrementLoginAttempt(user: GigUser): Promise<GigUser> {
        user.loginAttempts += 1;
        return GigUser.save(user);
    }

    async resetLoginAttempt(user: GigUser): Promise<GigUser> {
        user.loginAttempts = 0;
        return GigUser.save(user);
    }

}