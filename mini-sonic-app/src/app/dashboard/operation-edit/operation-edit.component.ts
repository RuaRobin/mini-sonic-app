import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Operation } from '../../dummydata/operation';
import { Item, ITEMS } from '../../dummydata/items';
import { AuthService } from '../../login/auth.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-operation-edit',
  standalone: false,
  templateUrl: './operation-edit.component.html',
  styleUrl: './operation-edit.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationEditComponent {
  form: FormGroup;
  operationTypes = ['Sale', 'Purchase', 'Return', 'Refund'];
  itemsInStock: Item[] = [];
  pageSize = 5; 
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OperationEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Operation,
    private authService: AuthService
  ) {
    const jwt = this.authService.getActiveUser();
    const saved = localStorage.getItem(`items_${jwt.userID}`);
    this.itemsInStock = saved ? JSON.parse(saved) : [...ITEMS];

    // Build a lookup of existing quantities from the operation being edited
    const existingQtyMap: Record<string, number> = {};
    (this.data.items ?? []).forEach((item: any) => {
      existingQtyMap[item.itemName] = item.quantity;
    });

    // Build one quantity control per stock item
    const qtyControls: Record<string, any> = {};
    this.itemsInStock.forEach(item => {
      qtyControls[item.itemName] = [
        existingQtyMap[item.itemName] ?? 0,
        [Validators.required, Validators.min(0)]
      ];
    });

    this.form = this.fb.group({
      operationType: [this.data.operationType, Validators.required],
      operationCustomer: [this.data.operationCustomer, Validators.required],
      operationDate: [this.toDateString(this.data.operationDate), Validators.required],
      notes: [this.data.notes ?? ''],
      quantities: this.fb.group(qtyControls),
    });
  }

  private toDateString(date: any): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }
 get paginatedItems():Item[]{
    const start = this.pageIndex * this.pageSize;
    return this.itemsInStock.slice(start,start+this.pageSize);
  }
  onPageChange(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  get quantitiesGroup(): FormGroup {
    return this.form.get('quantities') as FormGroup;
  }

  getQty(itemName: string): number {
    return this.quantitiesGroup.get(itemName)?.value ?? 0;
  }

  lineTotal(item: Item): number {
    return this.getQty(item.itemName) * (item.unitPrice ?? 0);
  }
  get taxTotal(): number {
    return this.itemsInStock.reduce((sum, item) => sum + (this.lineTotal(item)* (item.tax /100)) , 0)
  }
  get netTotal(): number {
    return this.grossTotal + this.taxTotal;
  }

  get grossTotal(): number {
    return this.itemsInStock.reduce((sum, item) => sum + this.lineTotal(item), 0);
  }

  save(): void {
    if (this.form.invalid) return;

    // Convert the flat quantity map back into an items array (only include qty > 0)
    const items = this.itemsInStock
      .filter(item => this.getQty(item.itemName) > 0)
      .map(item => ({
        itemName: item.itemName,
        quantity: this.getQty(item.itemName),
        unitPrice: item.unitPrice,
      }));

    const { quantities, ...rest } = this.form.value;
    const updated: Operation = {
      ...this.data,
      ...rest,
      items,
      netTotal: this.netTotal,
      grossTotal: this.grossTotal,
    };
    this.dialogRef.close(updated);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}