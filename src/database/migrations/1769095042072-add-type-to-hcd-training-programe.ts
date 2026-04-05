import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeToHcdTrainingPrograme1769095042072 implements MigrationInterface {
  name = 'AddTypeToHcdTrainingPrograme1769095042072';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITIES" ADD "TYPES" varchar2(255) DEFAULT 'BASE' NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITIES" DROP COLUMN "TYPES"`,
    );
  }
}
