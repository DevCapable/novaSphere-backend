import { MigrationInterface, QueryRunner } from 'typeorm';

export class EqRequestUnderstudies1723474386248 implements MigrationInterface {
  name = 'EqRequestUnderstudies1723474386248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUEST_UNDERSTUDIES" DROP CONSTRAINT "FK_cfc528b2330460e7215dfc34594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUEST_UNDERSTUDIES" MODIFY "REQUEST_ID" number  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUEST_UNDERSTUDIES" ADD CONSTRAINT "FK_cfc528b2330460e7215dfc34594" FOREIGN KEY ("REQUEST_ID") REFERENCES "EQ_REQUESTS" ("ID")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUEST_UNDERSTUDIES" DROP CONSTRAINT "FK_cfc528b2330460e7215dfc34594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUEST_UNDERSTUDIES" MODIFY "REQUEST_ID" number  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUEST_UNDERSTUDIES" ADD CONSTRAINT "FK_cfc528b2330460e7215dfc34594" FOREIGN KEY ("REQUEST_ID") REFERENCES "EQ_REQUESTS" ("ID")`,
    );
  }
}
