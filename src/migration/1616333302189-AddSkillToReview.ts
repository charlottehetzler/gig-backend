import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSkillToReview1616333302189 implements MigrationInterface {
    name = 'AddSkillToReview1616333302189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "skillId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "skillId"`);
    }

}
