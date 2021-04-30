import {MigrationInterface, QueryRunner} from "typeorm";

export class createGatitoTable1619735550527 implements MigrationInterface {
    name = 'createGatitoTable1619735550527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gatitos" ("status" character varying(8) NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(100) NOT NULL, CONSTRAINT "PK_7ccbf376c2d1c5d2a69bb9ee2ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_gatitos" ("usersId" integer NOT NULL, "gatitosId" integer NOT NULL, CONSTRAINT "PK_0f56662df026dc3937b2643b0ee" PRIMARY KEY ("usersId", "gatitosId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ae3405f23aca88c2588bd5d580" ON "user_gatitos" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a4a79ae6fd6e067000dd867190" ON "user_gatitos" ("gatitosId") `);
        await queryRunner.query(`ALTER TABLE "user_gatitos" ADD CONSTRAINT "FK_ae3405f23aca88c2588bd5d5809" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_gatitos" ADD CONSTRAINT "FK_a4a79ae6fd6e067000dd867190d" FOREIGN KEY ("gatitosId") REFERENCES "gatitos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_gatitos" DROP CONSTRAINT "FK_a4a79ae6fd6e067000dd867190d"`);
        await queryRunner.query(`ALTER TABLE "user_gatitos" DROP CONSTRAINT "FK_ae3405f23aca88c2588bd5d5809"`);
        await queryRunner.query(`DROP INDEX "IDX_a4a79ae6fd6e067000dd867190"`);
        await queryRunner.query(`DROP INDEX "IDX_ae3405f23aca88c2588bd5d580"`);
        await queryRunner.query(`DROP TABLE "user_gatitos"`);
        await queryRunner.query(`DROP TABLE "gatitos"`);
    }

}
