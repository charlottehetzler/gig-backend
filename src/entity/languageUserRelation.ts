import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Skill } from "./skill";
import { GigUser } from "./gigUser";
import { Language } from "./language";

@ObjectType()
@Entity() export class LanguageUserRelation extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: false})
  @Column({ nullable: false})
  languageId: number;

  @Field(type => Language, { nullable: true})
  @JoinColumn({ name: 'languageId' })
  @ManyToOne(type => Language)
  language: Language;

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
  createdAt: Date;

  @Field({ nullable: true})
  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

}
