import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('logs')
class Logs {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  action: string;

  @Column()
  sector: string;

  @Column()
  user: string;

  @Column()
  resource: string;

  @Column()
  data: unknown;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Logs;
