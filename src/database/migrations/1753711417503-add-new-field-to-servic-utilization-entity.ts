import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFieldToServicUtilizationEntity1753711417503 implements MigrationInterface {
  name = 'AddNewFieldToServicUtilizationEntity1753711417503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "TOTAL_SPEND" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "NIGERIAN_SPENT" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "FOREIGN_SPENT" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "CURRENCY_TOTAL_REV_TRANSACTN" varchar2(255)`,
    );

    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "TOTAL_SPEND" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "NIGERIAN_SPENT" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "FOREIGN_SPENT" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "CURRENCY_TOTAL_REV_TRANSACTN"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "FOREIGN_SPENT"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "NIGERIAN_SPENT"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "TOTAL_SPEND"`,
    );

    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "FOREIGN_SPENT"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "NIGERIAN_SPENT"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "TOTAL_SPEND"`,
    );
  }
}
