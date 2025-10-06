import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm'

export class InvitationTokens1703374688955 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const invitationTokensTable = new Table({
      name: 'invitationTokens',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          default: 'gen_random_uuid()',
        },
        {
          name: 'token',
          type: 'varchar',
          length: '128',
        },
        {
          name: 'comment',
          type: 'varchar',
          length: '128',
        },
        {
          name: 'isActive',
          type: 'boolean',
          default: false,
        },
        {
          name: 'allowedMultipleInvites',
          type: 'boolean',
          default: false,
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

    await queryRunner.createTable(invitationTokensTable, true);

    await queryRunner.createUniqueConstraint(
      invitationTokensTable,
      new TableUnique({
        name: 'UNIQUE_TOKEN_CONSTRAINT',
        columnNames: ['token'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invitationTokens');
  }
}
