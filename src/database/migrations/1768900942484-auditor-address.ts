import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditorAddress1768900942484 implements MigrationInterface {
  name = 'AuditorAddress1768900942484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_AUDITORS" ADD "ADDRESS" varchar2(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_AUDITORS" DROP COLUMN "ADDRESS"`,
    );
  }
}
