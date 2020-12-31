import {MigrationInterface, QueryRunner} from "typeorm";

export class AdjustGigJobRelation1609351960576 implements MigrationInterface {
    name = 'AdjustGigJobRelation1609351960576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_d93693f3e98706bcf00ea2d134d"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "REL_d93693f3e98706bcf00ea2d134"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "jobId"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "gigId" integer`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_7a6bc019444589472bae455200d" FOREIGN KEY ("gigId") REFERENCES "gig"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_7a6bc019444589472bae455200d"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "gigId"`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "jobId" integer`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "REL_d93693f3e98706bcf00ea2d134" UNIQUE ("jobId")`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_d93693f3e98706bcf00ea2d134d" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
