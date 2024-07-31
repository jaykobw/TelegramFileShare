import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  Unique,
  Default,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'filestore',
})
export class File extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;
}
