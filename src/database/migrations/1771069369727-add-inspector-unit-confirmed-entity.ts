import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInspectorUnitConfirmedEntity1771069369727
  implements MigrationInterface
{
  name = 'AddInspectorUnitConfirmedEntity1771069369727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "INSPECTOR_UNIT_CONFIRMED" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "INSPECTOR_UNIT_CONFIRMED"`,
    );
  }
}
