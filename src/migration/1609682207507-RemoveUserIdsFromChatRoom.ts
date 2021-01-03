import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveUserIdsFromChatRoom1609682207507 implements MigrationInterface {
    name = 'RemoveUserIdsFromChatRoom1609682207507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room" DROP COLUMN "firstUserId"`);
        await queryRunner.query(`ALTER TABLE "chat_room" DROP COLUMN "secondUserId"`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "chat_room" ADD "secondUserId" integer`);
        await queryRunner.query(`ALTER TABLE "chat_room" ADD "firstUserId" integer`);
    }

}
