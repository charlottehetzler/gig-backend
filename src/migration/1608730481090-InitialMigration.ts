import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1608730481090 implements MigrationInterface {
    name = 'InitialMigration1608730481090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_9b68f6ee0e1cb3c81de81451cbc"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "jobId"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "jobId" integer`);
        await queryRunner.query(`ALTER TABLE "job" ADD "producerId" integer`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_1302c6cddf76342df00e55d2e6d" FOREIGN KEY ("jobId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_d6a5e1b91e601c44d3f60cd3a14" FOREIGN KEY ("producerId") REFERENCES "producer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_d6a5e1b91e601c44d3f60cd3a14"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_1302c6cddf76342df00e55d2e6d"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "producerId"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "jobId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "jobId" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_9b68f6ee0e1cb3c81de81451cbc" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
