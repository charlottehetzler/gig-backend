import {MigrationInterface, QueryRunner} from "typeorm";

export class DeleteUserFromConsumerAndProducer1609423528438 implements MigrationInterface {
    name = 'DeleteUserFromConsumerAndProducer1609423528438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consumer" DROP CONSTRAINT "FK_f6a834cc95c095ee4ae1a85a01b"`);
        await queryRunner.query(`ALTER TABLE "producer" DROP CONSTRAINT "FK_4288c6992857e1af9db1c6b6eaf"`);
        await queryRunner.query(`ALTER TABLE "consumer" DROP CONSTRAINT "REL_f6a834cc95c095ee4ae1a85a01"`);
        await queryRunner.query(`ALTER TABLE "consumer" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "producer" DROP CONSTRAINT "REL_4288c6992857e1af9db1c6b6ea"`);
        await queryRunner.query(`ALTER TABLE "producer" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "gig"."price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gig" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "producer" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "producer" ADD CONSTRAINT "REL_4288c6992857e1af9db1c6b6ea" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "consumer" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "consumer" ADD CONSTRAINT "REL_f6a834cc95c095ee4ae1a85a01" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "producer" ADD CONSTRAINT "FK_4288c6992857e1af9db1c6b6eaf" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consumer" ADD CONSTRAINT "FK_f6a834cc95c095ee4ae1a85a01b" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
