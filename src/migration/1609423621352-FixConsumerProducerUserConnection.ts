import {MigrationInterface, QueryRunner} from "typeorm";

export class FixConsumerProducerUserConnection1609423621352 implements MigrationInterface {
    name = 'FixConsumerProducerUserConnection1609423621352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" DROP CONSTRAINT "FK_5eb333a893733f9539a07051412"`);
        await queryRunner.query(`ALTER TABLE "gig_user" DROP CONSTRAINT "FK_93550535d191fdb8867cd540fcf"`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig_user" ADD CONSTRAINT "FK_5eb333a893733f9539a07051412" FOREIGN KEY ("producerId") REFERENCES "producer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig_user" ADD CONSTRAINT "FK_93550535d191fdb8867cd540fcf" FOREIGN KEY ("consumerId") REFERENCES "consumer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" DROP CONSTRAINT "FK_93550535d191fdb8867cd540fcf"`);
        await queryRunner.query(`ALTER TABLE "gig_user" DROP CONSTRAINT "FK_5eb333a893733f9539a07051412"`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "gig_user" ADD CONSTRAINT "FK_93550535d191fdb8867cd540fcf" FOREIGN KEY ("consumerId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig_user" ADD CONSTRAINT "FK_5eb333a893733f9539a07051412" FOREIGN KEY ("producerId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
