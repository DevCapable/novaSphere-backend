import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInspectionUnittypeEntity1772060106763
  implements MigrationInterface
{
  name = 'AddInspectionUnittypeEntity1772060106763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "INSPECTION_UNIT_TYPE" varchar2(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "INSPECTION_UNIT_TYPE"`,
    );
  }
}
