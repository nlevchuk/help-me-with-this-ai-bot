import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm'

export class CreateUsers1703374692371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersTable = new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          default: 'gen_random_uuid()',
        },
        {
          name: 'invitationTokenId',
          type: 'uuid',
        },
        {
          name: 'telegramId',
          type: 'varchar',
          length: '32',
        },
        {
          name: 'apiCallsCount',
          type: 'integer',
          default: 0,
        },
        {
          name: 'apiCallsLimit',
          type: 'integer',
          default: 5,
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
    });

    await queryRunner.createTable(usersTable, true);

    await queryRunner.createUniqueConstraint(
      usersTable,
      new TableUnique({
        name: 'UNIQUE_TELEGRAD_ID_CONSTRAINT',
        columnNames: ['telegramId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
