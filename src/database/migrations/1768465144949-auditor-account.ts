import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditorAccount1768465144949 implements MigrationInterface {
  name = 'AuditorAccount1768465144949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ACCOUNT_AUDITORS" ("ACCOUNT_ID" number NOT NULL, "FIRST_NAME" varchar2(255) NOT NULL, "LAST_NAME" varchar2(255) NOT NULL, "EMAIL" varchar2(255) NOT NULL, "PHONE_NUMBER" varchar2(255), CONSTRAINT "PK_f5bcf8e157f36d51b53cbdd2ac5" PRIMARY KEY ("ACCOUNT_ID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_AUDITORS" ADD CONSTRAINT "FK_f5bcf8e157f36d51b53cbdd2ac5" FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_AUDITORS" DROP CONSTRAINT "FK_f5bcf8e157f36d51b53cbdd2ac5"`,
    );
    await queryRunner.query(`DROP TABLE "ACCOUNT_AUDITORS"`);
  }
}
