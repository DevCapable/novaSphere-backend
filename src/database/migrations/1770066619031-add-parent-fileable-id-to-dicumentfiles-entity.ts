import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentFileableIdToDicumentfilesEntity1770066619031
  implements MigrationInterface
{
  name = 'AddParentFileableIdToDicumentfilesEntity1770066619031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_FILES" ADD "PARENT_FILEABLE_ID" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_FILES" DROP COLUMN "PARENT_FILEABLE_ID"`,
    );
  }
}
