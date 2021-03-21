import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLanguagesToUser1616346462837 implements MigrationInterface {
    name = 'AddLanguagesToUser1616346462837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "language" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "languageId" integer, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_ea11e8bc4351d527a85fdfde610" FOREIGN KEY ("languageId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_ea11e8bc4351d527a85fdfde610"`);
        await queryRunner.query(`DROP TABLE "language"`);
    }

}
