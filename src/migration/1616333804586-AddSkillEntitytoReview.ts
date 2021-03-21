import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSkillEntitytoReview1616333804586 implements MigrationInterface {
    name = 'AddSkillEntitytoReview1616333804586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_ef1729120096086d5843d0fe4ad" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_ef1729120096086d5843d0fe4ad"`);
    }

}
