import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAgentTable1739624619742 implements MigrationInterface {
  name = 'CreateAgentTable1739624619742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`agent\` (\`id\` int NOT NULL AUTO_INCREMENT, \`parentId\` int NULL, \`agentId\` varchar(255) NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NULL, \`company\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` text NOT NULL, \`logo\` varchar(560) NULL, \`credit\` int NOT NULL DEFAULT '0', \`balance\` bigint NOT NULL DEFAULT '0', \`markuptype\` varchar(255) NULL, \`markup\` decimal(10,2) NOT NULL DEFAULT '0.00', \`partialEligibility\` tinyint NOT NULL DEFAULT 0, \`partialEligibilityValue\` decimal(10,2) NOT NULL DEFAULT '0.00', \`searchlimit\` int NOT NULL DEFAULT '0', \`nid\` varchar(560) NULL, \`tradelicense\` varchar(560) NULL, \`civilAviationNo\` varchar(560) NULL, \`accKeyManager\` varchar(560) NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`role\` varchar(255) NOT NULL DEFAULT 'main_agent', \`status\` varchar(255) NOT NULL DEFAULT 'pending',\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL,  UNIQUE INDEX \`IDX_c8e51500f3876fa1bbd4483ecc\` (\`email\`), UNIQUE INDEX \`IDX_6ce186739b805e81372116a0c6\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_6ce186739b805e81372116a0c6\` ON \`agent\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c8e51500f3876fa1bbd4483ecc\` ON \`agent\``,
    );
    await queryRunner.query(`DROP TABLE \`agent\``);
  }
}
