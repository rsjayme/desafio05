import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @Column()
  category_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}

export default Transaction;
