import { MigrationInterface, QueryRunner } from 'typeorm';

export class EqRequest1719986668638 implements MigrationInterface {
  name = 'EqRequest1719986668638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "UNDERSTUDY_TRAINING_TYPE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" ADD "UNDERSTUDY_TRAINING_TYPE" clob`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "UNDERSTUDY_TRAINING_DELIVERABLES"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" ADD "UNDERSTUDY_TRAINING_DELIVERABLES" clob`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "UNDERSTUDY_TRAINING_DELIVERABLES"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" ADD "UNDERSTUDY_TRAINING_DELIVERABLES" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "UNDERSTUDY_TRAINING_TYPE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" ADD "UNDERSTUDY_TRAINING_TYPE" varchar2(255)`,
    );
  }
}
