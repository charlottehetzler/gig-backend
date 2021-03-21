import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFriendStatus1616363510385 implements MigrationInterface {
    name = 'AddFriendStatus1616363510385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "friend" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "friend" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "friend" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language_user_relation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "friend" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "friend" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "friend" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "friend" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
