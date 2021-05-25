import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStatusToDeal1621872555488 implements MigrationInterface {
    name = 'AddStatusToDeal1621872555488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal" ADD "isClosed" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal" DROP COLUMN "isClosed"`);
    }

}
