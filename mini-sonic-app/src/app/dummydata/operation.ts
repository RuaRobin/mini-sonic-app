
import { Item } from "./items";

export interface Operation{
      operationID : string,
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
        operationID : "1",
        operationType: 'Sale',
        operationCustomer:'Ahmad',
        operationDate :new Date(),
        netTotal : 0,
        grossTotal : 0
    },
    {
        operationID : "2",
        operationType: 'Sale',
        operationCustomer:'Mohammad',
        operationDate :new Date(),
        netTotal : 0,
        grossTotal : 0
    }
]