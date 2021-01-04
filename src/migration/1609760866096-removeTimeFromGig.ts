import {MigrationInterface, QueryRunner} from "typeorm";

export class removeTimeFromGig1609760866096 implements MigrationInterface {
    name = 'removeTimeFromGig1609760866096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "time" character varying`);
    }

}
