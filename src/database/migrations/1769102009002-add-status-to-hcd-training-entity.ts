import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToHcdTrainingEntity1769102009002 implements MigrationInterface {
  name = 'AddStatusToHcdTrainingEntity1769102009002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" ADD "STATUS" varchar2(255) DEFAULT 'REGISTERED' NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" DROP COLUMN "STATUS"`,
    );
  }
}
