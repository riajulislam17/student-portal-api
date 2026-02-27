import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'results', timestamps: true, underscored: true })
export class Result extends Model<Result> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare studentId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare courseId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare instituteId: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare score: number;

  @Column({ type: DataType.DATE, allowNull: false })
  declare examDate: Date;
}
