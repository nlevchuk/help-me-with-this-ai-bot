import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddMaxMessageLengthToUsers1704812128746 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'maxMessageLength',
        type: 'integer',
        isNullable: false,
        default: 256,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'maxMessageLength');
  }
}
