import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNoOfNigerianizedCommToEqReqEntity1734615138244 implements MigrationInterface {
  name = 'AddNoOfNigerianizedCommToEqReqEntity1734615138244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "EQ_REQUESTS"
        ADD "NIGERIANIZATION_COMMITMENT_COUNT" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "NIGERIANIZATION_COMMITMENT_COUNT"`,
    );
  }
}
