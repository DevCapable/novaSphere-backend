import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModIndividaulAccountTable1726832446358 implements MigrationInterface {
  name = 'ModIndividaulAccountTable1726832446358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_INDIVIDUALS" ADD "COMPETENCY_ID" varchar2(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_INDIVIDUALS" DROP COLUMN "COMPETENCY_ID"`,
    );
  }
}
