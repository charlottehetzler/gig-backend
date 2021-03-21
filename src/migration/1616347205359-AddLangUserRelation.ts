import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLangUserRelation1616347205359 implements MigrationInterface {
    name = 'AddLangUserRelation1616347205359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_69eb92e6b51565cf9a3d28f614b"`);
        await queryRunner.query(`CREATE TABLE "language_user_relation" ("id" SERIAL NOT NULL, "languageId" integer NOT NULL, "userId" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f56977383be12fe5d3a6e1afbea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" ADD CONSTRAINT "FK_c348a54125acfe955527982db8a" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" ADD CONSTRAINT "FK_823423b0509db92848169be44fa" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language_user_relation" DROP CONSTRAINT "FK_823423b0509db92848169be44fa"`);
        await queryRunner.query(`ALTER TABLE "language_user_relation" DROP CONSTRAINT "FK_c348a54125acfe955527982db8a"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "userId" integer`);
        await queryRunner.query(`DROP TABLE "language_user_relation"`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_69eb92e6b51565cf9a3d28f614b" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
