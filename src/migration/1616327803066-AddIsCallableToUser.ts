import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsCallableToUser1616327803066 implements MigrationInterface {
    name = 'AddIsCallableToUser1616327803066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" ADD "isCallable" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" DROP COLUMN "isCallable"`);
    }

}
