import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlugToNctrcMatrixCriteriaEntity1770650551939
  implements MigrationInterface
{
  name = 'AddSlugToNctrcMatrixCriteriaEntity1770650551939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD "SLUG" varchar2(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" ADD CONSTRAINT "UQ_598e9cc45981cd53261a3784f88" UNIQUE ("SLUG")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP CONSTRAINT "UQ_598e9cc45981cd53261a3784f88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_MATRIX_CRITERIA" DROP COLUMN "SLUG"`,
    );
  }
}
