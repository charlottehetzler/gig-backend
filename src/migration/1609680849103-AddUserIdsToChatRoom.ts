import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserIdsToChatRoom1609680849103 implements MigrationInterface {
    name = 'AddUserIdsToChatRoom1609680849103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room" ADD "firstUserId" integer`);
        await queryRunner.query(`ALTER TABLE "chat_room" ADD "secondUserId" integer`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "chat_room" DROP COLUMN "secondUserId"`);
        await queryRunner.query(`ALTER TABLE "chat_room" DROP COLUMN "firstUserId"`);
    }

}
