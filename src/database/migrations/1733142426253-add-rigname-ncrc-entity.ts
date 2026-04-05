import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRignameNcrcEntity1733142426253 implements MigrationInterface {
  name = 'AddRignameNcrcEntity1733142426253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "NCRC_APPLICATIONS"
        ADD "RIG_NAME" varchar2(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCRC_APPLICATIONS" DROP COLUMN "RIG_NAME"`,
    );
  }
}
