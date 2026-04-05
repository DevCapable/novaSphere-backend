import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentFiles1718762579912 implements MigrationInterface {
  name = 'DocumentFiles1718762579912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_FILES" MODIFY "MIME_TYPE" varchar2(255)  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_FILES" MODIFY "SIZE" number  NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_FILES" MODIFY "SIZE" number  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_FILES" MODIFY "MIME_TYPE" varchar2(255)  NOT NULL`,
    );
  }
}
