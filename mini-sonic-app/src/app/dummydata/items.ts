
export interface Item{
    ItemID : number,
    ItemName: string,
    unitPrice: number,
    quantity: number,
    tax: number
}

export const ITEMS :Item[]=[{
    ItemID: 1, 
    ItemName: "Tuna Can",
    unitPrice: 1.75,
    quantity: 5,
    tax : 0.16
},
{
    ItemID: 1, 
    ItemName: "Hummus",
    unitPrice: 1.75,
    quantity: 5,
    tax : 0.01
}
]