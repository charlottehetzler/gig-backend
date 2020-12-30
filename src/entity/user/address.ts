import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";
import { GigUser } from "./gigUser";

@ObjectType()
@Entity() export class Address extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ nullable: false })
    @Field({ nullable: false })
    streetRoadName: string;

    @Column({ nullable: false })
    @Field()
    houseNumber: string;

	@Column({ nullable: true })
    @Field({ nullable: true })
    apartmentSuiteNo: string;

    @Field({ nullable: true })
	@Column({ nullable: true })
    zipPostalCode: string;

	@Column({ nullable: true })
    @Field({ nullable: true })
    cityTownVillageLocality: string;

	@Column({ nullable: false })
	@Field({ nullable: false })
    stateCounty: string;

	@Column({ nullable: true })
	@Field({ nullable: true })
    region: string;

	@Column({ nullable: false })
	@Field({ nullable: false })
    country: string;

    @Column({ nullable: true })
	@Field({ nullable: true })
    note: string;

    @CreateDateColumn({ nullable: false })
    @Field(type => GraphQLISODateTime)
    createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @ManyToOne(type => GigUser, user => user.addresses)
    @JoinColumn({ name: 'userId' })
    @Field(type => GigUser)
    user: GigUser;
}