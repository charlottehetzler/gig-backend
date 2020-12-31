import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDecimalToRating1609400849469 implements MigrationInterface {
    name = 'AddDecimalToRating1609400849469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "rating" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "rating" integer NOT NULL`);
    }

}
