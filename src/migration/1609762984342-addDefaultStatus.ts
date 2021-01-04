import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultStatus1609762984342 implements MigrationInterface {
    name = 'addDefaultStatus1609762984342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."status" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "status" SET DEFAULT 'open'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."status" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
    }

}
