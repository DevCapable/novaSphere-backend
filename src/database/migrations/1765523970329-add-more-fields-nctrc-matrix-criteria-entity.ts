import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreFieldsNctrcMatrixCriteriaEntity1765523970329
  implements MigrationInterface
{
  name = 'AddMoreFieldsNctrcMatrixCriteriaEntity1765523970329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "OWNED_MARK" number NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "LEASED_MARK" number NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "YES" number NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "NO" number NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "GRADED_MEMBERSHIP" number NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "NONE_GRADED_PRACTITIONER" number NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "DOC_TYPE" varchar2(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "LEASED_MARK"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "OWNED_MARK"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "YES"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "NO"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "GRADED_MEMBERSHIP"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "NONE_GRADED_PRACTITIONER"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "DOC_TYPE"`,
    );
  }
}
