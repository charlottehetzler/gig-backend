import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Job } from "./job";
import { Producer } from "../user/producer";

@ObjectType()
@Entity() export class JobProducerRelation extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: false})
  @Column({ nullable: false})
  jobId: number;

  @Field(type => Job, { nullable: true})
  @JoinColumn({ name: 'jobId' })
  @ManyToOne(type => Job)
  job: Job;

  @Field({ nullable: false})
  @Column({ nullable: false})
  producerId: number;

  @Field(type => Producer, { nullable: true})
  @JoinColumn({ name: 'producerId' })
  @ManyToOne(type => Producer)
  producer: Producer;

  @Field({ nullable: true})
  @Field({ nullable: true })
  @CreateDateColumn()
  createdDate: Date;

  @Field({ nullable: true})
  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedDate: Date;

}
