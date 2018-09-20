import { OrdersContent } from './orders-content';
import { Status } from '../tools/status.enum';
import { Users } from './users';

export class Orders {
  public id?: number;
  public numberOrder?: string;
  public dateOfCreation?: Date;
  public user?: Users;
  public dateOfStep?: Date;
  public status?: Status;
  public address?: string;
  public listOrderItems?: OrdersContent[];

  constructor(id?: number, numberOrder?: string, dateOfCreation?: Date, user?: Users,
    dateOfStep?: Date, status?: Status, address?: string, listOrderItems?: OrdersContent[]) {
      this.id = id;
      this.numberOrder = numberOrder;
      this.dateOfCreation = dateOfCreation;
      this.user = user;
      this.dateOfStep = dateOfStep;
      this.status = status;
      this.address = address;
      this.listOrderItems = listOrderItems;

  }
}
