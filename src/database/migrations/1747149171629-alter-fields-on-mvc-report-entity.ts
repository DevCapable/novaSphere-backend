import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFieldsOnMvcReportEntity1747149171629 implements MigrationInterface {
  name = 'AlterFieldsOnMvcReportEntity1747149171629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "MVC_REPORT_ITEMS" DROP CONSTRAINT "FK_cc84fd412546509dca802596671"`,
    );
    await queryRunner.query(`CREATE TABLE "MVC_REPORT_ITEM_FLAGS"
                             (
                               "MVC_REPORT_ITEM_ID" number NOT NULL,
                               "BASE_RECORD_ID"     number NOT NULL,
                               CONSTRAINT "PK_27021ea0ff8ec62fcc5f4948ad5" PRIMARY KEY ("MVC_REPORT_ITEM_ID", "BASE_RECORD_ID")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_f3f943ff2bf68bd85c2a2d0a62" ON "MVC_REPORT_ITEM_FLAGS" ("MVC_REPORT_ITEM_ID")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0845e362709d6a1907e2609065" ON "MVC_REPORT_ITEM_FLAGS" ("BASE_RECORD_ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "MVC_REPORT_ITEMS" DROP COLUMN "FLAG_ID"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_0845e362709d6a1907e2609065"`);
    await queryRunner.query(`ALTER TABLE "MVC_REPORT_ITEM_FLAGS"
      ADD CONSTRAINT "FK_f3f943ff2bf68bd85c2a2d0a62d" FOREIGN KEY ("MVC_REPORT_ITEM_ID") REFERENCES "MVC_REPORT_ITEMS" ("ID") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "MVC_REPORT_ITEM_FLAGS"
      ADD CONSTRAINT "FK_0845e362709d6a1907e26090659" FOREIGN KEY ("BASE_RECORD_ID") REFERENCES "BASE_RECORDS" ("ID") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "MVC_REPORT_ITEM_FLAGS" DROP CONSTRAINT "FK_0845e362709d6a1907e26090659"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MVC_REPORT_ITEM_FLAGS" DROP CONSTRAINT "FK_f3f943ff2bf68bd85c2a2d0a62d"`,
    );
    await queryRunner.query(`ALTER TABLE "MVC_REPORT_ITEMS"
      ADD "FLAG_ID" number`);
    await queryRunner.query(`DROP INDEX "IDX_f3f943ff2bf68bd85c2a2d0a62"`);
    await queryRunner.query(`DROP TABLE "MVC_REPORT_ITEM_FLAGS"`);
    await queryRunner.query(`ALTER TABLE "MVC_REPORT_ITEMS"
      ADD CONSTRAINT "FK_cc84fd412546509dca802596671" FOREIGN KEY ("FLAG_ID") REFERENCES "BASE_RECORDS" ("ID")`);
  }
}
