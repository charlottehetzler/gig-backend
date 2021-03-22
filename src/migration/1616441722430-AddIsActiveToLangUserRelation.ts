import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsActiveToLangUserRelation1616441722430 implements MigrationInterface {
    name = 'AddIsActiveToLangUserRelation1616441722430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language_user_relation" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language_user_relation" DROP COLUMN "isActive"`);
    }

}
