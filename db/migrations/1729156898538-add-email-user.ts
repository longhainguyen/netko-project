import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailUser1729156898538 implements MigrationInterface {
    name = 'AddEmailUser1729156898538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }

}
