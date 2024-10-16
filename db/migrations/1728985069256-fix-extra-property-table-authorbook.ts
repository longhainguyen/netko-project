import { MigrationInterface, QueryRunner } from "typeorm";

export class FixExtraPropertyTableAuthorbook1728985069256 implements MigrationInterface {
    name = 'FixExtraPropertyTableAuthorbook1728985069256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author_book" DROP CONSTRAINT "PK_9984fc11c944b1edaf5b0a65b29"`);
        await queryRunner.query(`ALTER TABLE "author_book" DROP COLUMN "questionToCategoryId"`);
        await queryRunner.query(`ALTER TABLE "author_book" DROP COLUMN "questionId"`);
        await queryRunner.query(`ALTER TABLE "author_book" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "author_book" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD "authorBookId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD CONSTRAINT "PK_bf2fb8c2e1c0fa912590b5e36dc" PRIMARY KEY ("authorBookId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author_book" DROP CONSTRAINT "PK_bf2fb8c2e1c0fa912590b5e36dc"`);
        await queryRunner.query(`ALTER TABLE "author_book" DROP COLUMN "authorBookId"`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD "categoryId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD "questionId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD "questionToCategoryId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD CONSTRAINT "PK_9984fc11c944b1edaf5b0a65b29" PRIMARY KEY ("questionToCategoryId")`);
    }

}
