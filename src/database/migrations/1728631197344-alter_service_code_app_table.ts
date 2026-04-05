import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterServiceCodeAppTable1728631197344 implements MigrationInterface {
  name = 'AlterServiceCodeAppTable1728631197344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" DROP COLUMN "APPROVAL_DATE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" ADD "CERTIFICATE_NUMBER" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" ADD CONSTRAINT "UQ_bb045f604d8948eb836f8556401" UNIQUE ("CERTIFICATE_NUMBER")`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" ADD "DATE_APPROVED" timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" ADD "WF_CASE_ID" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" ADD "PARENT_ID" number`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_572a97b6a168986a126a4f668d" ON "SERVICE_CODE_APPLICATIONS" ("APP_NUMBER", "CERTIFICATE_NUMBER")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" DROP COLUMN "PARENT_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" DROP COLUMN "WF_CASE_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" DROP COLUMN "DATE_APPROVED"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" DROP CONSTRAINT "UQ_bb045f604d8948eb836f8556401"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" DROP COLUMN "CERTIFICATE_NUMBER"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICE_CODE_APPLICATIONS" ADD "APPROVAL_DATE" timestamp`,
    );
  }
}
