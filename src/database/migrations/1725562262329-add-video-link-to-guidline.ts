import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVideoLinkToGuidline1725562262329 implements MigrationInterface {
  name = 'AddVideoLinkToGuidline1725562262329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "GUIDELINES"
        ADD "VIDEO_LINK" varchar2(3000)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GUIDELINES" DROP COLUMN "VIDEO_LINK"`,
    );
  }
}
