import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModAcademic1723666868942 implements MigrationInterface {
  name = 'ModAcademic1723666868942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD "INSTITUTION_OTHER" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD "FOREIGN_COURSE" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD "FOREIGN_DISCIPLINE" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD "FOREIGN_PROGRAM" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD "SECONDARY_CLASS" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_3f03fb7967b8c21d98e1a0d5baf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_7e14946036b0125bdd2e55eb791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_8fd13ba6ca3cac304759735d4fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_1d374048a6359a75d54261ce3cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "LEVEL_ID" number  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "COURSE_ID" number  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "INSTITUTION_ID" number  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "DEGREE_ID" number  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_3f03fb7967b8c21d98e1a0d5baf" FOREIGN KEY ("LEVEL_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_7e14946036b0125bdd2e55eb791" FOREIGN KEY ("COURSE_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_8fd13ba6ca3cac304759735d4fc" FOREIGN KEY ("INSTITUTION_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_1d374048a6359a75d54261ce3cc" FOREIGN KEY ("DEGREE_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_1d374048a6359a75d54261ce3cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_8fd13ba6ca3cac304759735d4fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_7e14946036b0125bdd2e55eb791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP CONSTRAINT "FK_3f03fb7967b8c21d98e1a0d5baf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "DEGREE_ID" number  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "INSTITUTION_ID" number  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "COURSE_ID" number  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "LEVEL_ID" number  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_1d374048a6359a75d54261ce3cc" FOREIGN KEY ("DEGREE_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_8fd13ba6ca3cac304759735d4fc" FOREIGN KEY ("INSTITUTION_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_7e14946036b0125bdd2e55eb791" FOREIGN KEY ("COURSE_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" ADD CONSTRAINT "FK_3f03fb7967b8c21d98e1a0d5baf" FOREIGN KEY ("LEVEL_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP COLUMN "SECONDARY_CLASS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP COLUMN "FOREIGN_PROGRAM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP COLUMN "FOREIGN_DISCIPLINE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP COLUMN "FOREIGN_COURSE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" DROP COLUMN "INSTITUTION_OTHER"`,
    );
  }
}
