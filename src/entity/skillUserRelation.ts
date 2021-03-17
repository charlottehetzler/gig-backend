import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Skill } from "./skill";
import { GigUser } from "./gigUser";

@ObjectType()
@Entity() export class SkillUserRelation extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: false})
  @Column({ nullable: false})
  skillId: number;

  @Field(type => Skill, { nullable: true})
  @JoinColumn({ name: 'skillId' })
  @ManyToOne(type => Skill)
  skill: Skill;

  @Field({ nullable: false})
  @Column({ nullable: false})
  userId: number;

  @Field(type => GigUser, { nullable: true})
  @JoinColumn({ name: 'userId' })
  @ManyToOne(type => GigUser)
  user: GigUser;

  @Field({ nullable: true})
  @Field({ nullable: true })
  @CreateDateColumn()
  createdDate: Date;

  @Field({ nullable: true})
  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedDate: Date;

}
