import { MigrationInterface, QueryRunner } from 'typeorm';

export class ManyToManyAuthorBooks1728973130327 implements MigrationInterface {
  name = 'ManyToManyAuthorBooks1728973130327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "author_book" ("questionToCategoryId" SERIAL NOT NULL, "questionId" integer NOT NULL, "categoryId" integer NOT NULL, "order" integer NOT NULL, "userId" integer, "bookId" integer, CONSTRAINT "PK_9984fc11c944b1edaf5b0a65b29" PRIMARY KEY ("questionToCategoryId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "author_book" ADD CONSTRAINT "FK_566cedfa71826ce51ab723e2fc6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "author_book" ADD CONSTRAINT "FK_7781d00994265ab0a4e8d5eda75" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "author_book" DROP CONSTRAINT "FK_7781d00994265ab0a4e8d5eda75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "author_book" DROP CONSTRAINT "FK_566cedfa71826ce51ab723e2fc6"`,
    );
    await queryRunner.query(`DROP TABLE "author_book"`);
  }
}
