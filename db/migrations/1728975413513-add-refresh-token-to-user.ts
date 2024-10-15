import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUser1728975413513 implements MigrationInterface {
  name = 'AddRefreshTokenToUser1728975413513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
  }
}
