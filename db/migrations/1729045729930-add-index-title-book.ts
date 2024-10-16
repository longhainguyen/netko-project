import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexTitleBook1729045729930 implements MigrationInterface {
    name = 'AddIndexTitleBook1729045729930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_c10a44a29ef231062f22b1b7ac" ON "book" ("title") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c10a44a29ef231062f22b1b7ac"`);
    }

}
