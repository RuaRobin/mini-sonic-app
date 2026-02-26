import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Operation } from '../../dummydata/operation';

@Component({
  selector: 'app-operation-view',
standalone: false,
  templateUrl: './operation-view.component.html',
  styleUrl: './operation-view.component.css',
})
export class OperationViewComponent{

  constructor(public dialogRef : MatDialogRef<OperationViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data : Operation
  ){}

  close(){
    this.dialogRef.close();
  }

  lineTotal(quantity: number, unitPrice: number){

    return quantity * unitPrice;
  }


}
