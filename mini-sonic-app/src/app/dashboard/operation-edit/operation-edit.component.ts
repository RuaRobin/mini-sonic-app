import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Operation } from '../../dummydata/operation';

@Component({
  selector: 'app-operation-edit',
  standalone: false,
  templateUrl: './operation-edit.component.html',
  styleUrl: './operation-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush   // fixes ExpressionChangedAfterChecked
})
export class OperationEditComponent {
  form: FormGroup;
  operationTypes = ['Sale', 'Purchase', 'Return', 'Refund'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OperationEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Operation
  ) {
   
    this.form = this.fb.group({
      operationType: [this.data.operationType, Validators.required],
      operationCustomer: [this.data.operationCustomer, Validators.required],
      operationDate: [this.toDateString(this.data.operationDate), Validators.required],
      notes: [this.data.notes ?? ''],
      items: this.fb.array(
        (this.data.items ?? []).map(item =>
          this.fb.group({
            ItemName: [item.ItemName, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
          })
        )
      ),
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        ItemName: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [0, [Validators.required, Validators.min(0)]],
      })
    );
  }
private toDateString(date: any): string {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}
  removeItem(index: number): void {
      this.items.removeAt(index);
  }

  lineTotal(index: number): number {
    const item = this.items.at(index).value;
    return (item.quantity ?? 0) * (item.unitPrice ?? 0);
  }

  get netTotal(): number {
    return this.items.controls.reduce((sum, _, i) => sum + this.lineTotal(i), 0);
  }

  get grossTotal(): number {
    return this.netTotal;
  }

  save(): void {
    if (this.form.invalid) return;

    const updated: Operation = {
      ...this.data,
      ...this.form.value,
      netTotal: this.netTotal,
      grossTotal: this.grossTotal,
    };

    this.dialogRef.close(updated);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}