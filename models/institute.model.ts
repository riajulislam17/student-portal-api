import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'institutes', timestamps: true, underscored: true })
export class Institute extends Model<Institute> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  declare email: string | null;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare address: string | null;
}
