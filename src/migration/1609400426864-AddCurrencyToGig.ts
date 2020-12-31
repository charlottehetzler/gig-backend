import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCurrencyToGig1609400426864 implements MigrationInterface {
    name = 'AddCurrencyToGig1609400426864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" ADD "currency" character varying NOT NULL DEFAULT '$'`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "price" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "currency"`);
    }

}
