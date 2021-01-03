import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAddressToGig1609697394319 implements MigrationInterface {
    name = 'AddAddressToGig1609697394319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" ADD "addressId" integer`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "UQ_d308c498c40c43f3c6f0994fc72" UNIQUE ("addressId")`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_d308c498c40c43f3c6f0994fc72" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_d308c498c40c43f3c6f0994fc72"`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "UQ_d308c498c40c43f3c6f0994fc72"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "addressId"`);
    }

}
