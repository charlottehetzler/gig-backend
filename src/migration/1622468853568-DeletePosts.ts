import {MigrationInterface, QueryRunner} from "typeorm";

export class DeletePosts1622468853568 implements MigrationInterface {
    name = 'DeletePosts1622468853568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gig" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "fromDate" TIMESTAMP NOT NULL, "toDate" TIMESTAMP, "isClosed" boolean DEFAULT false, "isAd" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, "skillId" integer, "userId" integer, CONSTRAINT "PK_18bb613fc8f2dba24c9e701f91b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_c55289d5e6d714ad808cdf63e8f" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_445ce5780c65262153b780d567a" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_bfd629e7a4261291c19e52f7a2f" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_bfd629e7a4261291c19e52f7a2f"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_445ce5780c65262153b780d567a"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_c55289d5e6d714ad808cdf63e8f"`);
        await queryRunner.query(`DROP TABLE "gig"`);
    }

}
