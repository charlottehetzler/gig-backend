import {MigrationInterface, QueryRunner} from "typeorm";

export class UserTypeToUser1609423035336 implements MigrationInterface {
    name = 'UserTypeToUser1609423035336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user_type" DROP CONSTRAINT "FK_a6457c3dce6eae4a401bd77ac0c"`);
        await queryRunner.query(`ALTER TABLE "gig_user_type" DROP CONSTRAINT "REL_a6457c3dce6eae4a401bd77ac0"`);
        await queryRunner.query(`ALTER TABLE "gig_user_type" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "gig_user" ADD "typeId" integer`);
        await queryRunner.query(`ALTER TABLE "gig_user" ADD CONSTRAINT "UQ_e8547a37e95b6bbbbc909603916" UNIQUE ("typeId")`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig_user" ADD CONSTRAINT "FK_e8547a37e95b6bbbbc909603916" FOREIGN KEY ("typeId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user" DROP CONSTRAINT "FK_e8547a37e95b6bbbbc909603916"`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "gig_user" DROP CONSTRAINT "UQ_e8547a37e95b6bbbbc909603916"`);
        await queryRunner.query(`ALTER TABLE "gig_user" DROP COLUMN "typeId"`);
        await queryRunner.query(`ALTER TABLE "gig_user_type" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "gig_user_type" ADD CONSTRAINT "REL_a6457c3dce6eae4a401bd77ac0" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "gig_user_type" ADD CONSTRAINT "FK_a6457c3dce6eae4a401bd77ac0c" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
