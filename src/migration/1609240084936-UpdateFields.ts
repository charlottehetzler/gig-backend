import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateFields1609240084936 implements MigrationInterface {
    name = 'UpdateFields1609240084936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_method" DROP CONSTRAINT "FK_34a4419ef2010224d7ff600659d"`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "fromUserId" integer NOT NULL, "toUserId" integer NOT NULL, "rating" integer NOT NULL, "comment" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "amount" integer NOT NULL, "attachment" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gigId" integer, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "gig" ADD "time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_method" ADD CONSTRAINT "FK_34a4419ef2010224d7ff600659d" FOREIGN KEY ("userId") REFERENCES "consumer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_8ebba7ec0727485eeb296224994" FOREIGN KEY ("gigId") REFERENCES "gig"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_8ebba7ec0727485eeb296224994"`);
        await queryRunner.query(`ALTER TABLE "payment_method" DROP CONSTRAINT "FK_34a4419ef2010224d7ff600659d"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP COLUMN "date"`);
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`ALTER TABLE "payment_method" ADD CONSTRAINT "FK_34a4419ef2010224d7ff600659d" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
