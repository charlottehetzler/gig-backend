import { Resolver, Query, Arg, InputType, Field, Mutation } from 'type-graphql';
import { Consumer } from '../entity/user/consumer';
import { getRepository } from 'typeorm';
import { PaymentMethod } from '../entity/payment/paymentMethod';
import { PaymentType } from '../entity/types/payment';
import { PaymentDetails } from '../entity/payment/paymentDetails';

@InputType()
export class PaymentDetailsQuery {
    @Field({ nullable: true })
    paymentMethodId?: number;

    @Field({ nullable: true })
    userName?: string;

    @Field({ nullable: true })
    cardNumber?: string;

    @Field({ nullable: true })
    expirationDate?: Date;

    @Field({ nullable: true })
    securityCode?: number;
    
    @Field({ nullable: true })
    consumerId?: number;
}

@InputType()
export class PaymentMethodQuery {
    @Field({ nullable: true })
    paymentMethodId?: number;

    @Field({ nullable: true })
    type?: PaymentType;

    @Field({ nullable: true })
    userName?: string;

    @Field({ nullable: true })
    cardNumber?: string;

    @Field({ nullable: true })
    expirationDate?: Date;

    @Field({ nullable: true })
    securityCode?: number;
    
    @Field({ nullable: true })
    consumerId?: number;
}

@Resolver()
export class PaymentResolver {
    // All PaymentMethods
    @Query(returns => [PaymentMethod])
    async getAllPaymentMethods() : Promise <PaymentMethod[]> {
        try {
            return await PaymentMethod.find();
        } catch (error) {
            throw `PaymentResolver.getAllPaymentMethods errored. Error Msg: ${error}`;            
        }
    }

    // PaymentMethods for Consumer
    @Query(returns => [PaymentMethod])
    async getAllPaymentMethodsForConsumer (
    @Arg('consumerId') consumerId: number,
    @Arg('first', { defaultValue: 10 }) first: number = 10,
    @Arg('offset', { defaultValue: 0 }) offset: number = 0,
    ) : Promise <PaymentMethod[]> {
        try {
            const consumer = await Consumer.findOne(consumerId);
            return await PaymentMethod.find({ take: first, skip: offset, where: {consumer: consumer}, order: {updatedAt: "DESC"} });
        } catch (error) {
            throw `PaymentResolver.getAllPaymentMethodsForConsumer errored for consumer ${consumerId}. Error Msg: ${error}`;            
        }
    }

    // PaymentMethod for Consumer
    @Query(returns => PaymentDetails)
    async getOnePaymentMethod (@Arg('paymentMethodId') paymentMethodId: number) : Promise < PaymentDetails> {
        try {
            return await  PaymentDetails.findOne(paymentMethodId);
        } catch (error) {
            throw `PaymentResolver.getAllPaymentMethodsForConsumer errored for paymentMethod ${paymentMethodId}. Error Msg: ${error}`;            
        }
    }

    // Add PaymentMethod-Details
    @Mutation(() => PaymentMethod)
    async addPaymentMethod(@Arg('input') input: PaymentMethodQuery): Promise<PaymentMethod> {
        try {
            const consumer = await Consumer.findOne(input.consumerId)
            const paymentMethod = new PaymentMethod();
            paymentMethod.consumer = consumer;
            paymentMethod.type = input.type;
            await paymentMethod.save();
    
            const paymentDetails = new PaymentDetails();
            if (input.type === PaymentType.creditCard || input.type === PaymentType.debitCard) {
                paymentDetails.userName = input.userName;
                paymentDetails.cardNumber = input.cardNumber;
                paymentDetails.expirationDate = input.expirationDate;
                paymentDetails.securityCode = input.securityCode;
                paymentDetails.paymentMethod = paymentMethod;
                await paymentDetails.save();
            }
            return paymentMethod;
        } catch (error) {
            throw `PaymentResolver.addPaymentMethod errored for paymentMethodId: ${input.paymentMethodId}. Error Msg: ${error}`;            
        }
    }

    // Modify PaymentMethod-Details
    @Mutation(() => PaymentDetails)
    async updatePaymentMethod(@Arg('input') input: PaymentDetailsQuery): Promise<PaymentDetails> {
        try {
            let data = (input as unknown) as PaymentDetails;
    
            if (input.paymentMethodId) {
                const existing = await PaymentDetails.findOne(input.paymentMethodId);
                if (existing) {
                    const tmp : any = {
                        ...existing,
                        ...input
                    };
                    data = tmp as PaymentDetails;
                }
            }
            const paymentDetails = await getRepository(PaymentDetails).save(data);
            return paymentDetails;
        } catch (error) {
            throw `PaymentResolver.updatePaymentMethod errored for paymentMethodId: ${input.paymentMethodId}. Error Msg: ${error}`;
        }
    }

    // Delete PaymentMethod
    @Mutation(() => Boolean)
    async deletePaymentMethod(@Arg('paymentMethodId') paymentMethodId: number) {
        try {
            const paymentDetails = await PaymentDetails.findOne(paymentMethodId);
            await paymentDetails.remove();
    
            const paymentMethod = await PaymentMethod.findOne(paymentMethodId);
            await paymentMethod.remove();
            return true;
        } catch (error) {
            throw `PaymentResolver.deletePaymentMethod errored for paymentMethodId: ${paymentMethodId}. Error Msg: ${error}`;
        }
    }
}
