import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFriendConnection1616362478699 implements MigrationInterface {
    name = 'AddFriendConnection1616362478699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friend" ("id" SERIAL NOT NULL, "currentUserId" integer NOT NULL, "userId" integer NOT NULL, "status" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1b301ac8ac5fcee876db96069b6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "friend"`);
    }

}
