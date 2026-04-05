import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFieldsToServiceUtilApplicationEntity1753017452002 implements MigrationInterface {
  name = 'AddNewFieldsToServiceUtilApplicationEntity1753017452002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_RETENTIONS_CLOSING_BALANCES" ADD "DATE_REJECTED" timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_RETENTIONS_CLOSING_BALANCES" ADD "IS_REJECTED" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "DUE_DATE" timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "CURRENCY_VOLUME_OF_TRANSACTION" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "VOLUME_OF_TRANSACTION" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "CURRENCY_VALUE_OF_TRANSACTION" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "PERCENTAGE_OF_TOTAL_FEE_PAID" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "CURRENCY_TOTAL_SPENT" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "CURRENCY_TOTAL_NIG_OPERATION" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "TOTAL_NIG_OPERATION" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "CURRENCY_TOTAL_SPENT_FOREIGN" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "TOTAL_SPENT_FOREIGN" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "PERCENTAGE_OF_TOTAL_FEE_PAID" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "PERCENTAGE_OF_TOTAL_FEE_PAID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "PERCENTAGE_OF_TOTAL_FEE_PAID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "CURRENCY_VALUE_OF_TRANSACTION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "VOLUME_OF_TRANSACTION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "CURRENCY_VOLUME_OF_TRANSACTION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "DUE_DATE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_RETENTIONS_CLOSING_BALANCES" DROP COLUMN "IS_REJECTED"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_RETENTIONS_CLOSING_BALANCES" DROP COLUMN "DATE_REJECTED"`,
    );

    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "CURRENCY_TOTAL_SPENT"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "TOTAL_NIG_OPERATION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "CURRENCY_TOTAL_NIG_OPERATION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "TOTAL_SPENT_FOREIGN"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "CURRENCY_TOTAL_SPENT_FOREIGN"`,
    );
  }
}
