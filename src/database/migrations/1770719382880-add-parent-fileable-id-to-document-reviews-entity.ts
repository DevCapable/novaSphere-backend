import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentFileableIdToDocumentReviewsEntity1770719382880
  implements MigrationInterface
{
  name = 'AddParentFileableIdToDocumentReviewsEntity1770719382880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_REVIEWS" ADD "PARENT_FILEABLE_ID" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DOCUMENT_REVIEWS" DROP COLUMN "PARENT_FILEABLE_ID"`,
    );
  }
}
