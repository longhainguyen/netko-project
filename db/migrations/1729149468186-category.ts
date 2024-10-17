import { MigrationInterface, QueryRunner } from "typeorm";

export class Category1729149468186 implements MigrationInterface {
    name = 'Category1729149468186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "book" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_efaa1a4d8550ba5f4378803edb2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_efaa1a4d8550ba5f4378803edb2"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
