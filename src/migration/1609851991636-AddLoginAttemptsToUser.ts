import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLoginAttemptsToUser1609851991636 implements MigrationInterface {
    name = 'AddLoginAttemptsToUser1609851991636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" ADD "loginAttempts" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "gig_user" DROP COLUMN "loginAttempts"`);
    }

}
