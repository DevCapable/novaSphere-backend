import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdditionalFieldsToServiceUtilizationApplication1752945256205 implements MigrationInterface {
  name = 'AddAdditionalFieldsToServiceUtilizationApplication1752945256205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "DATE_REJECTED" timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "REVIEWER_ID" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD "DISCUSSION" clob`,
    );

    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" ADD CONSTRAINT "FK_ae1bceadf8b4ea2d80db01bfc09" FOREIGN KEY ("REVIEWER_ID") REFERENCES "USERS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "UNIQUE_KEY"`,
    );

    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "DATE_REJECTED" timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "IS_REJECTED" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP CONSTRAINT "FK_ae1bceadf8b4ea2d80db01bfc09"`,
    );

    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "DISCUSSION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "REVIEWER_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATION_APPLICATIONS" DROP COLUMN "DATE_REJECTED"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" ADD "UNIQUE_KEY" varchar2(255) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "DATE_REJECTED"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_UTILIZATIONS_REPORTS" DROP COLUMN "IS_REJECTED"`,
    );
  }
}
