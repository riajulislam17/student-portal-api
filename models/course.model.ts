import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'courses', timestamps: true, underscored: true })
export class Course extends Model<Course> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare slug: string;
}
