import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

export enum FRIEND_STATUS {
    accepted = "accepted",
    pending = "pending",
    declined = "declined"
}

@ObjectType()
@Entity() export class Friend extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: false})
  @Column({ nullable: false})
  currentUserId: number;

  @Field({ nullable: false})
  @Column({ nullable: false})
  userId: number;

  @Field({ nullable: false})
  @Column({ nullable: false})
  status: FRIEND_STATUS;

  @Field({ nullable: true})
  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true})
  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

}
