import { Status } from '../tools/status.enum';
import { Users } from './users';

export class Orders {
  public id?: number;
  public numberOrder?: number;
  public dateOfCreation?: Date;
  public user?: Users;
  public dateOfStep?: Date;
  public status?: Status;
  public address?: string;

  constructor(id?: number, numberOrder?: number, dateOfCreation?: Date, user?: Users,
    dateOfStep?: Date, status?: Status, address?: string) {
      this.id = id;
      this.numberOrder = numberOrder;
      this.dateOfCreation = dateOfCreation;
      this.user = user;
      this.dateOfStep = dateOfStep;
      this.status = status;
      this.address = address;

  }
}
