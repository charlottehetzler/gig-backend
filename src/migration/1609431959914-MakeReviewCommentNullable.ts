import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeReviewCommentNullable1609431959914 implements MigrationInterface {
    name = 'MakeReviewCommentNullable1609431959914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "comment" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "review"."comment" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "review"."comment" IS NULL`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "comment" SET NOT NULL`);
    }

}
