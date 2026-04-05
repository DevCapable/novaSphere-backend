import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderToDocumentsTable1724056056547 implements MigrationInterface {
  name = 'AddOrderToDocumentsTable1724056056547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DOCUMENTS" ADD "ORDER" number DEFAULT 0 NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "DOCUMENTS" DROP COLUMN "ORDER"`);
  }
}
