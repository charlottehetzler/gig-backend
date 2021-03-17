import {MigrationInterface, QueryRunner} from "typeorm";

export class updateSkill1615995334272 implements MigrationInterface {
    name = 'updateSkill1615995334272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "description"`);
    }

}
