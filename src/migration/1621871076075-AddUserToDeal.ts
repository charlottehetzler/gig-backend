import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserToDeal1621871076075 implements MigrationInterface {
    name = 'AddUserToDeal1621871076075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "deal" ADD CONSTRAINT "FK_4731e00e0d2378a614e4c2f549a" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal" DROP CONSTRAINT "FK_4731e00e0d2378a614e4c2f549a"`);
        await queryRunner.query(`ALTER TABLE "deal" DROP COLUMN "userId"`);
    }

}
