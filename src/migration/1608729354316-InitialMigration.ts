import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1608729354316 implements MigrationInterface {
    name = 'InitialMigration1608729354316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "jobId" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "streetRoadName" character varying NOT NULL, "houseNumber" character varying NOT NULL, "apartmentSuiteNo" character varying, "zipPostalCode" character varying, "cityTownVillageLocality" character varying, "stateCounty" character varying NOT NULL, "region" character varying, "country" character varying NOT NULL, "note" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_method" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gig_user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "birthday" TIMESTAMP NOT NULL, "profilePicture" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b2dea9a93d308e8408ca2cbf56c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consumer" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_f6a834cc95c095ee4ae1a85a01" UNIQUE ("userId"), CONSTRAINT "PK_85625b4d465d3aa0eb905127822" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "producer" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_4288c6992857e1af9db1c6b6ea" UNIQUE ("userId"), CONSTRAINT "PK_4cfe496c2c70e4c9b9f444525a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gig" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" integer NOT NULL, "status" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "jobId" integer, "consumerId" integer, "producerId" integer, CONSTRAINT "REL_d93693f3e98706bcf00ea2d134" UNIQUE ("jobId"), CONSTRAINT "PK_18bb613fc8f2dba24c9e701f91b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "dateOfPayment" TIMESTAMP NOT NULL, "amount" integer NOT NULL, "purpose" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "consumerId" integer, "gigId" integer, "accountId" integer, "paymentMethodId" integer, CONSTRAINT "REL_7598159d1cb98fa302e8d1c084" UNIQUE ("consumerId"), CONSTRAINT "REL_8716b9d2231745643d171bfd44" UNIQUE ("gigId"), CONSTRAINT "REL_fb76bf2f52ca15e599f50bb34a" UNIQUE ("paymentMethodId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "accountName" character varying NOT NULL, "balance" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "consumerId" integer, CONSTRAINT "REL_70cc40426b1ad9dafac6cbbbd7" UNIQUE ("consumerId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_details" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "cardNumber" character varying, "expirationDate" TIMESTAMP, "securityCode" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "paymentMethodId" integer, CONSTRAINT "REL_dcbcfbf1aceba3ed4e032a282c" UNIQUE ("paymentMethodId"), CONSTRAINT "PK_309f873cfbc20f57796956a1d33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gig_user_type" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_a6457c3dce6eae4a401bd77ac0" UNIQUE ("userId"), CONSTRAINT "PK_f7f051fee26244ff38164da3dfb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_9b68f6ee0e1cb3c81de81451cbc" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_method" ADD CONSTRAINT "FK_34a4419ef2010224d7ff600659d" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consumer" ADD CONSTRAINT "FK_f6a834cc95c095ee4ae1a85a01b" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producer" ADD CONSTRAINT "FK_4288c6992857e1af9db1c6b6eaf" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_d93693f3e98706bcf00ea2d134d" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_a3df701f526324fe89cfe424c9f" FOREIGN KEY ("consumerId") REFERENCES "consumer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig" ADD CONSTRAINT "FK_dea09e3570b846b118cb01a248e" FOREIGN KEY ("producerId") REFERENCES "producer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_7598159d1cb98fa302e8d1c084d" FOREIGN KEY ("consumerId") REFERENCES "consumer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_8716b9d2231745643d171bfd44b" FOREIGN KEY ("gigId") REFERENCES "gig"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_25ee41d829b06c6e7451b89037f" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_fb76bf2f52ca15e599f50bb34ae" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_70cc40426b1ad9dafac6cbbbd72" FOREIGN KEY ("consumerId") REFERENCES "consumer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_details" ADD CONSTRAINT "FK_dcbcfbf1aceba3ed4e032a282cf" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gig_user_type" ADD CONSTRAINT "FK_a6457c3dce6eae4a401bd77ac0c" FOREIGN KEY ("userId") REFERENCES "gig_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gig_user_type" DROP CONSTRAINT "FK_a6457c3dce6eae4a401bd77ac0c"`);
        await queryRunner.query(`ALTER TABLE "payment_details" DROP CONSTRAINT "FK_dcbcfbf1aceba3ed4e032a282cf"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_70cc40426b1ad9dafac6cbbbd72"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_fb76bf2f52ca15e599f50bb34ae"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_25ee41d829b06c6e7451b89037f"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_8716b9d2231745643d171bfd44b"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_7598159d1cb98fa302e8d1c084d"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_dea09e3570b846b118cb01a248e"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_a3df701f526324fe89cfe424c9f"`);
        await queryRunner.query(`ALTER TABLE "gig" DROP CONSTRAINT "FK_d93693f3e98706bcf00ea2d134d"`);
        await queryRunner.query(`ALTER TABLE "producer" DROP CONSTRAINT "FK_4288c6992857e1af9db1c6b6eaf"`);
        await queryRunner.query(`ALTER TABLE "consumer" DROP CONSTRAINT "FK_f6a834cc95c095ee4ae1a85a01b"`);
        await queryRunner.query(`ALTER TABLE "payment_method" DROP CONSTRAINT "FK_34a4419ef2010224d7ff600659d"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_9b68f6ee0e1cb3c81de81451cbc"`);
        await queryRunner.query(`DROP TABLE "gig_user_type"`);
        await queryRunner.query(`DROP TABLE "payment_details"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "gig"`);
        await queryRunner.query(`DROP TABLE "producer"`);
        await queryRunner.query(`DROP TABLE "consumer"`);
        await queryRunner.query(`DROP TABLE "gig_user"`);
        await queryRunner.query(`DROP TABLE "payment_method"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "job"`);
    }

}
