import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommunityVendors1753105322966 implements MigrationInterface {
  name = 'CommunityVendors1753105322966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ACCOUNT_COMMUNITY_VENDORS" ("ACCOUNT_ID" number NOT NULL, "NAME" varchar2(255) NOT NULL, "EMAIL" varchar2(255) NOT NULL, "ADDRESS" varchar2(255), "PHONE_NUMBER" varchar2(255), "STATE_ID" number, CONSTRAINT "PK_0f94cf23a69cd7a01435e28d889" PRIMARY KEY ("ACCOUNT_ID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMMUNITY_VENDORS" ADD CONSTRAINT "FK_0f94cf23a69cd7a01435e28d889" FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMMUNITY_VENDORS" ADD CONSTRAINT "FK_35182956db387273643aa37ba9e" FOREIGN KEY ("STATE_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMMUNITY_VENDORS" DROP CONSTRAINT "FK_35182956db387273643aa37ba9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMMUNITY_VENDORS" DROP CONSTRAINT "FK_0f94cf23a69cd7a01435e28d889"`,
    );
    await queryRunner.query(`DROP TABLE "ACCOUNT_COMMUNITY_VENDORS"`);
  }
}
