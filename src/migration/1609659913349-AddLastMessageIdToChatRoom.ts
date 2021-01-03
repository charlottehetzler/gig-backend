import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLastMessageIdToChatRoom1609659913349 implements MigrationInterface {
    name = 'AddLastMessageIdToChatRoom1609659913349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room" ADD "lastMessageId" integer`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "chat_room" DROP COLUMN "lastMessageId"`);
    }

}
