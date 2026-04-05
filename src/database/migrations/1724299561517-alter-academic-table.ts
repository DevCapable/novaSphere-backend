import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAcademicTable1724299561517 implements MigrationInterface {
  name = 'AlterAcademicTable1724299561517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "DISCIPLINE_ID" number  NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACADEMICS" MODIFY "DISCIPLINE_ID" number  NOT NULL`,
    );
  }
}
