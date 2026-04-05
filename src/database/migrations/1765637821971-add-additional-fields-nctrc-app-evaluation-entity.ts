import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdditionalFieldsNctrcAppEvaluationEntity1765637821971
  implements MigrationInterface
{
  name = 'AddAdditionalFieldsNctrcAppEvaluationEntity1765637821971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "OWNED_MARK" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "LEASED_MARK" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "YES" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "NO" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "GRADED_MEMBERSHIP" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" ADD "NONE_GRADED_PRACTITIONER" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "NONE_GRADED_PRACTITIONER"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "GRADED_MEMBERSHIP"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "NO"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "YES"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "LEASED_MARK"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATION_EVALUATIONS" DROP COLUMN "OWNED_MARK"`,
    );
  }
}
