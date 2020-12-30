import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeJobIdToCategoryId1609243416700 implements MigrationInterface {
    name = 'ChangeJobIdToCategoryId1609243416700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_1302c6cddf76342df00e55d2e6d"`);
        await queryRunner.query(`ALTER TABLE "job" RENAME COLUMN "jobId" TO "categoryId"`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_ab0702755e36375136d7b54207f" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_ab0702755e36375136d7b54207f"`);
        await queryRunner.query(`ALTER TABLE "job" RENAME COLUMN "categoryId" TO "jobId"`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_1302c6cddf76342df00e55d2e6d" FOREIGN KEY ("jobId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
