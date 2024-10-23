import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAuthorBook1729655556397 implements MigrationInterface {
    name = 'UpdateAuthorBook1729655556397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author_book" DROP CONSTRAINT "FK_566cedfa71826ce51ab723e2fc6"`);
        await queryRunner.query(`ALTER TABLE "author_book" DROP CONSTRAINT "FK_7781d00994265ab0a4e8d5eda75"`);
        await queryRunner.query(`ALTER TABLE "author_book" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ALTER COLUMN "bookId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD CONSTRAINT "FK_566cedfa71826ce51ab723e2fc6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD CONSTRAINT "FK_7781d00994265ab0a4e8d5eda75" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author_book" DROP CONSTRAINT "FK_7781d00994265ab0a4e8d5eda75"`);
        await queryRunner.query(`ALTER TABLE "author_book" DROP CONSTRAINT "FK_566cedfa71826ce51ab723e2fc6"`);
        await queryRunner.query(`ALTER TABLE "author_book" ALTER COLUMN "bookId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD CONSTRAINT "FK_7781d00994265ab0a4e8d5eda75" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "author_book" ADD CONSTRAINT "FK_566cedfa71826ce51ab723e2fc6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
