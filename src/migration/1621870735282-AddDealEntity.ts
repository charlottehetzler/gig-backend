import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDealEntity1621870735282 implements MigrationInterface {
    name = 'AddDealEntity1621870735282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deal" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "fromDate" TIMESTAMP NOT NULL, "toDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, "skillId" integer, CONSTRAINT "PK_9ce1c24acace60f6d7dc7a7189e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deal" ADD CONSTRAINT "FK_f59ef26c5f408999a1a3962e7ba" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal" ADD CONSTRAINT "FK_33e7c7ecc1b9159b3c8b4f6f99a" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal" DROP CONSTRAINT "FK_33e7c7ecc1b9159b3c8b4f6f99a"`);
        await queryRunner.query(`ALTER TABLE "deal" DROP CONSTRAINT "FK_f59ef26c5f408999a1a3962e7ba"`);
        await queryRunner.query(`DROP TABLE "deal"`);
    }

}
