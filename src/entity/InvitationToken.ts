import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'invitationTokens' })
export class InvitationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 128 })
  token: string;

  @Column({ length: 256 })
  comment: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  allowedMultipleInvites: boolean;

  @Column({ nullable: true })
  defaultApiCallsLimit?: number

  @Column({ nullable: true })
  defaultMaxMessageLength?: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
