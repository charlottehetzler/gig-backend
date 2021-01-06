import {MigrationInterface, QueryRunner} from "typeorm";

export class AddHashedPWToUser1609851210981 implements MigrationInterface {
    name = 'AddHashedPWToUser1609851210981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" ADD "hashedPassword" character varying`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "gig_user" DROP COLUMN "hashedPassword"`);
    }

}
