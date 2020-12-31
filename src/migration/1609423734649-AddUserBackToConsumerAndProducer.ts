import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserBackToConsumerAndProducer1609423734649 implements MigrationInterface {
    name = 'AddUserBackToConsumerAndProducer1609423734649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "producer" ADD CONSTRAINT "UQ_4288c6992857e1af9db1c6b6eaf" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "consumer" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "consumer" ADD CONSTRAINT "UQ_f6a834cc95c095ee4ae1a85a01b" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "producer" ADD CONSTRAINT "FK_4288c6992857e1af9db1c6b6eaf" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consumer" ADD CONSTRAINT "FK_f6a834cc95c095ee4ae1a85a01b" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consumer" DROP CONSTRAINT "FK_f6a834cc95c095ee4ae1a85a01b"`);
        await queryRunner.query(`ALTER TABLE "producer" DROP CONSTRAINT "FK_4288c6992857e1af9db1c6b6eaf"`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "consumer" DROP CONSTRAINT "UQ_f6a834cc95c095ee4ae1a85a01b"`);
        await queryRunner.query(`ALTER TABLE "consumer" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "producer" DROP CONSTRAINT "UQ_4288c6992857e1af9db1c6b6eaf"`);
        await queryRunner.query(`ALTER TABLE "producer" DROP COLUMN "userId"`);
    }

}
