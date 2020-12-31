import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveToUserIdFromReview1609359300750 implements MigrationInterface {
    name = 'RemoveToUserIdFromReview1609359300750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "toUserId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "toUserId" integer NOT NULL`);
    }

}
