import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVeriedAtUser1729486451997 implements MigrationInterface {
    name = 'AddEmailVeriedAtUser1729486451997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerifiedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerifiedAt"`);
    }

}
