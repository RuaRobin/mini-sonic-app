import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../login/auth.service';
import { Operation } from '../../dummydata/operation';
import { Item, ITEMS } from '../../dummydata/items';

@Component({
  selector: 'app-add-operation',
  standalone: false,
  templateUrl: './add-operation.component.html',
  styleUrl: './add-operation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOperationComponent {
  form: FormGroup;
  operationTypes = ['Sale', 'Purchase', 'Return', 'Refund'];
  private storageKey: string;
  private itemsStorageKey: string;

  itemsInStock: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    const jwt = this.authService.getActiveUser();
    this.storageKey = `operations_${jwt.userID}`;
    this.itemsStorageKey = `items_${jwt.userID}`;

    const saved = localStorage.getItem(this.itemsStorageKey);
    this.itemsInStock = saved ? JSON.parse(saved) : [...ITEMS];

    // One quantity control per stock item, keyed by itemName
    const quantityControls: Record<string, any> = {};
    for (const item of this.itemsInStock) {
      quantityControls[item.itemName] = [0, [Validators.required, Validators.min(0)]];
    }

    this.form = this.fb.group({
      operationType: ['Sale', Validators.required],
      operationCustomer: ['', Validators.required],
      operationDate: [this.todayString(), Validators.required],
      notes: [''],
      quantities: this.fb.group(quantityControls),
    });
  }

  private todayString(): string {
    return new Date().toISOString().split('T')[0];
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

  get netTotal(): number {
    return this.grossTotal + this.taxTotal ;
  }

  get grossTotal(): number {
    return this.itemsInStock.reduce((sum, item) => sum + this.lineTotal(item), 0) ;
  }
  get taxTotal(): number{
    return this.itemsInStock.reduce((sum,item)=> sum + (this.getQty(item.itemName) * item.tax ),0)
  }
  get hasSelectedItems(): boolean {
    return this.itemsInStock.some(item => this.getQty(item.itemName) > 0);
  }

  private generateID(): string {
    return 'OP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  save(): void {
    if (this.form.invalid || !this.hasSelectedItems) return;

    const quantities = this.quantitiesGroup.value;

    // Only save items where qty > 0
    const selectedItems = this.itemsInStock
      .filter(item => quantities[item.itemName] > 0)
      .map(item => ({
        itemID: item.itemID,
        itemName: item.itemName,
        category: item.category,
        unitPrice: item.unitPrice,
        quantity: quantities[item.itemName],
        tax:item.tax
      }));

    const newOperation: Operation = {
      operationID: this.generateID(),
      operationType: this.form.value.operationType,
      operationCustomer: this.form.value.operationCustomer,
      operationDate: this.form.value.operationDate,
      notes: this.form.value.notes,
      items: selectedItems,
      netTotal: this.netTotal,
      grossTotal: this.grossTotal,
    };

    const existing: Operation[] = JSON.parse(
      localStorage.getItem(this.storageKey) ?? 'null'
    ) ?? [];

    localStorage.setItem(
      this.storageKey,
      JSON.stringify([...existing, newOperation])
    );

    this.router.navigate(['/dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}