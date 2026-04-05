import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddYearTraininedHcdTrainingPrograsEntity1769623436060 implements MigrationInterface {
  name = 'AddYearTraininedHcdTrainingPrograsEntity1769623436060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" ADD "YEAR_TRAINED" date NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" DROP COLUMN "YEAR_TRAINED"`,
    );
  }
}
