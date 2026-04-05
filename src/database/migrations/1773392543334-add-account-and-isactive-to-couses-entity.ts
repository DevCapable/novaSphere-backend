import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountAndIsactiveToCousesEntity1773392543334 implements MigrationInterface {
  name = 'AddAccountAndIsactiveToCousesEntity1773392543334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_COURSES" ADD "ACCOUNT_ID" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_COURSES" ADD "IS_ACTIVE" number DEFAULT 1 NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_COURSES" ADD CONSTRAINT "FK_2d6d9372df6063b5998c32ab34e" FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_COURSES" DROP CONSTRAINT "FK_2d6d9372df6063b5998c32ab34e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_COURSES" DROP COLUMN "IS_ACTIVE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_COURSES" DROP COLUMN "ACCOUNT_ID"`,
    );
  }
}
