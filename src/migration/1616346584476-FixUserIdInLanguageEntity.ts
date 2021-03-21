import {MigrationInterface, QueryRunner} from "typeorm";

export class FixUserIdInLanguageEntity1616346584476 implements MigrationInterface {
    name = 'FixUserIdInLanguageEntity1616346584476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_ea11e8bc4351d527a85fdfde610"`);
        await queryRunner.query(`ALTER TABLE "language" RENAME COLUMN "languageId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_69eb92e6b51565cf9a3d28f614b" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_69eb92e6b51565cf9a3d28f614b"`);
        await queryRunner.query(`ALTER TABLE "language" RENAME COLUMN "userId" TO "languageId"`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_ea11e8bc4351d527a85fdfde610" FOREIGN KEY ("languageId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
