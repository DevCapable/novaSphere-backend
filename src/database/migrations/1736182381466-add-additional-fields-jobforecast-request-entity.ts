import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdditionalFieldsJobforecastRequestEntity1736182381466 implements MigrationInterface {
  name = 'AddAdditionalFieldsJobforecastRequestEntity1736182381466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_REQUESTS"
        ADD "TENDER_TYPE" varchar2(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_REQUESTS"
        ADD "CONTRACT_OPERATION_CATEGORY" varchar2(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" DROP COLUMN "CONTRACT_OPERATION_CATEGORY"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" DROP COLUMN "TENDER_TYPE"`,
    );
  }
}
