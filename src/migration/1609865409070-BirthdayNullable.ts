import {MigrationInterface, QueryRunner} from "typeorm";

export class BirthdayNullable1609865409070 implements MigrationInterface {
    name = 'BirthdayNullable1609865409070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig_user" ALTER COLUMN "birthday" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gig_user"."birthday" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig_user"."birthday" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig_user" ALTER COLUMN "birthday" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
    }

}
