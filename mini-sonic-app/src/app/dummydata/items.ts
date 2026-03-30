
export interface Item{
    itemID : string,
    itemName: string,
    category:string,
    unitPrice: number,
    quantity: number,
    tax: number
}

export const ITEMS :Item[]=[{
    itemID: "1", 
    itemName: "Tuna Can",
    category:"Canned Goods",
    unitPrice: 1.75,
    quantity: 5,
    tax : 0.16
},
{
    itemID: "2", 
    itemName: "Hummus",
    category:"Canned Goods",
    unitPrice: 1.75,
    quantity: 5,
    tax : 0.01
}
]