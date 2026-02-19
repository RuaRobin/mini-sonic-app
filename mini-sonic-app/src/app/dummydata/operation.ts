export interface Operation{
      operationID : number,
        operationType: string,
        operationCustomer:string ,
        operationDate : Date,
        netTotal : number,
        grossTotal : number
}

export const OPERATIONS :Operation[]=[
    {
        operationID : 1,
        operationType: 'sale',
        operationCustomer:'',
        operationDate :new Date(),
        netTotal : 110,
        grossTotal : 200
    },
    {
        operationID : 2,
        operationType: 'sale',
        operationCustomer:'',
        operationDate :new Date(),
        netTotal : 200,
        grossTotal : 200
    }
]