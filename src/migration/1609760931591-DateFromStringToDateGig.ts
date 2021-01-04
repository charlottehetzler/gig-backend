import {MigrationInterface, QueryRunner} from "typeorm";

export class DateFromStringToDateGig1609760931591 implements MigrationInterface {
    name = 'DateFromStringToDateGig1609760931591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "date" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
    }

}
