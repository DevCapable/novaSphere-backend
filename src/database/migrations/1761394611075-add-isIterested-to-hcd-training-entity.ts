import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsIterestedToHcdTrainingEntity1761394611075 implements MigrationInterface {
  name = 'AddIsIterestedToHcdTrainingEntity1761394611075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" ADD "IS_INTERESTED" number DEFAULT 0 NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" DROP COLUMN "IS_INTERESTED"`,
    );
  }
}
