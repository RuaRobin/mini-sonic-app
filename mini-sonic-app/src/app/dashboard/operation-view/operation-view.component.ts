import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Operation } from '../../dummydata/operation';

@Component({
  selector: 'app-operation-view',
  standalone: false,
  templateUrl: './operation-view.component.html',
  styleUrl: './operation-view.component.css',
})
export class OperationViewComponent {

  constructor(
    public dialogRef: MatDialogRef<OperationViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Operation
  ) {}

  close(): void {
    this.dialogRef.close(null);
  }

  // Close the view dialog and tell the table to open the edit dialog
  edit(): void {
    this.dialogRef.close({ edit: true, data: this.data });
  }

  lineTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }
}