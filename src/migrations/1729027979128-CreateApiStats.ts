import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateApiStats1729027979128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const apiStatsTable = new Table({
      name: 'apiStats',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          default: 'gen_random_uuid()',
        },
        {
          name: 'userId',
          type: 'uuid',
        },
        {
          name: 'modelName',
          type: 'varchar',
          length: '64',
        },
        {
          name: 'promptTokens',
          type: 'integer',
        },
        {
          name: 'completionTokens',
          type: 'integer',
        },
        {
          name: 'createdAt',
          type: 'timestamptz',
          default: 'current_timestamp(0)',
        },
        {
          name: 'updatedAt',
          type: 'timestamptz',
          default: 'current_timestamp(0)',
        },
      ],
      foreignKeys: [
        new TableForeignKey({
          columnNames: ['userId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ],
    });

    const ifNotExist = true;
    await queryRunner.createTable(apiStatsTable, ifNotExist);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('apiStats');
  }
}
