import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'filestore',
})
export class FileModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_size!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_owner!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_format!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_upload_origin!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  telegram_file_id!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;
}
