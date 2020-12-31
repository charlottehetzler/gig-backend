import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeDecimalToStringForRating1609406027183 implements MigrationInterface {
    name = 'ChangeDecimalToStringForRating1609406027183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "rating" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "rating" numeric NOT NULL`);
    }

}
