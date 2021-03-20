import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsPersonalToSkillUserRelation1616266091244 implements MigrationInterface {
    name = 'AddIsPersonalToSkillUserRelation1616266091244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_user_relation" ADD "isPersonal" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_user_relation" DROP COLUMN "isPersonal"`);
    }

}
