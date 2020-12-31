import {MigrationInterface, QueryRunner} from "typeorm";

export class AdjustJobProducerRelation1609355752244 implements MigrationInterface {
    name = 'AdjustJobProducerRelation1609355752244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_d6a5e1b91e601c44d3f60cd3a14"`);
        await queryRunner.query(`CREATE TABLE "job_producer_relation" ("id" SERIAL NOT NULL, "jobId" integer NOT NULL, "producerId" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5155bc84a41aedd28617e97a4dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "producerId"`);
        await queryRunner.query(`ALTER TABLE "job_producer_relation" ADD CONSTRAINT "FK_54d7a2514c1466097c6e06261ef" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_producer_relation" ADD CONSTRAINT "FK_cc232371e38fff1e4e90a197f94" FOREIGN KEY ("producerId") REFERENCES "producer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_producer_relation" DROP CONSTRAINT "FK_cc232371e38fff1e4e90a197f94"`);
        await queryRunner.query(`ALTER TABLE "job_producer_relation" DROP CONSTRAINT "FK_54d7a2514c1466097c6e06261ef"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "producerId" integer`);
        await queryRunner.query(`DROP TABLE "job_producer_relation"`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_d6a5e1b91e601c44d3f60cd3a14" FOREIGN KEY ("producerId") REFERENCES "producer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
