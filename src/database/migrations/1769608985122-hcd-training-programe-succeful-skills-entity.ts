import { MigrationInterface, QueryRunner } from 'typeorm';

export class HcdTrainingProgrameSuccefulSkillsEntity1769608985122 implements MigrationInterface {
  name = 'HcdTrainingProgrameSuccefulSkillsEntity1769608985122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "HCD_PREVIOUS_TRAINING_SKILLS" ("HCD_TRAINING_ENTITY_ID" number NOT NULL, "HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITY_ID" number NOT NULL, CONSTRAINT "PK_3cd5efdd242b9b9ba672b883d22" PRIMARY KEY ("HCD_TRAINING_ENTITY_ID", "HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITY_ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7dd23306bcf68e3dc99ee7be67" ON "HCD_PREVIOUS_TRAINING_SKILLS" ("HCD_TRAINING_ENTITY_ID")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fa69e655c76c084de7c6aa4e5" ON "HCD_PREVIOUS_TRAINING_SKILLS" ("HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITY_ID")`,
    );

    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" ADD "HAS_BEEN_TRAINED" number`,
    );

    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" ADD "PARENT_ID" number`,
    );

    await queryRunner.query(
      `ALTER TABLE "HCD_PREVIOUS_TRAINING_SKILLS" ADD CONSTRAINT "FK_7dd23306bcf68e3dc99ee7be67d" FOREIGN KEY ("HCD_TRAINING_ENTITY_ID") REFERENCES "HCD_TRAINING_ENTITIES" ("ID") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "HCD_PREVIOUS_TRAINING_SKILLS" ADD CONSTRAINT "FK_1fa69e655c76c084de7c6aa4e59" FOREIGN KEY ("HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITY_ID") REFERENCES "HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITIES" ("ID") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "HCD_PREVIOUS_TRAINING_SKILLS" DROP CONSTRAINT "FK_1fa69e655c76c084de7c6aa4e59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "HCD_PREVIOUS_TRAINING_SKILLS" DROP CONSTRAINT "FK_7dd23306bcf68e3dc99ee7be67d"`,
    );

    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_PROGRAM_SKILLS_BASE_ENTITIES" MODIFY "TYPES" varchar2(255) DEFAULT 'BASE' `,
    );
    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" DROP COLUMN "PARENT_ID"`,
    );

    await queryRunner.query(
      `ALTER TABLE "HCD_TRAINING_ENTITIES" DROP COLUMN "HAS_BEEN_TRAINED"`,
    );

    await queryRunner.query(`DROP INDEX "IDX_1fa69e655c76c084de7c6aa4e5"`);
    await queryRunner.query(`DROP INDEX "IDX_7dd23306bcf68e3dc99ee7be67"`);
    await queryRunner.query(`DROP TABLE "HCD_PREVIOUS_TRAINING_SKILLS"`);
  }
}
