import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeDateAndTimeToStringForGig1609697083381 implements MigrationInterface {
    name = 'MakeDateAndTimeToStringForGig1609697083381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "date" character varying`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "time" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "date" TIMESTAMP`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
    }

}
