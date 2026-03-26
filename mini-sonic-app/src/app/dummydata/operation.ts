
import { Item } from "./items";

export interface Operation{
      operationID : number,
        operationType: string,
        operationCustomer:string ,
        operationDate : Date,
        netTotal : number,
        grossTotal : number,
        notes?: string,
        items?: Item[];
}

export const OPERATIONS :Operation[]=[
    {
        operationID : 1,
        operationType: 'Sale',
        operationCustomer:'',
        operationDate :new Date(),
        netTotal : 110,
        grossTotal : 200
    },
    {
        operationID : 2,
        operationType: 'Sale',
        operationCustomer:'',
        operationDate :new Date(),
        netTotal : 200,
        grossTotal : 200
    }
]