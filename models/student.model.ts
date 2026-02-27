import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Institute } from 'models/institute.model';

@Table({ tableName: 'students', timestamps: true, underscored: true })
export class Student extends Model<Student> {
  @ForeignKey(() => Institute)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare instituteId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare class: string;

//   @Column({ type: DataType.INTEGER, allowNull: false })
//   declare roll: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare section: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare email: string | null;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
    defaultValue: [],
  })
  declare courseIds: number[];
}
