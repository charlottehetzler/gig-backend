import {MigrationInterface, QueryRunner} from "typeorm";

export class addPhoneNumberToUser1616187665362 implements MigrationInterface {
    name = 'addPhoneNumberToUser1616187665362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" ADD "phoneNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" DROP COLUMN "phoneNumber"`);
    }

}
