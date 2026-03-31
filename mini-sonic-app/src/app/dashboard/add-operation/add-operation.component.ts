import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../login/auth.service';
import { Operation } from '../../dummydata/operation';
import { Item, ITEMS } from '../../dummydata/items';
import { NotificationsService } from '../../notification.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-operation',
  standalone: false,
  templateUrl: './add-operation.component.html',
  styleUrl: './add-operation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush //check once for propgating the the components bindings 
})
export class AddOperationComponent {
  form: FormGroup;
  operationTypes = ['Sale', 'Purchase', 'Return', 'Refund'];
  private storageKey: string;
  private itemsStorageKey: string;
  filteredItems: Item[]=[];
  searchQuery: string = '';
  itemsInStock: Item[] = [];
  pageSize = 5; 
  pageIndex = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationsService
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
    this.filteredItems=[...this.itemsInStock];
  }

  get paginatedItems():Item[]{
    const start = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(start,start+this.pageSize);
  }
  onPageChange(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  applySearch(event : Event): void{
    const query= (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchQuery = query;
    this.pageIndex= 0 ;
    this.filteredItems =this.itemsInStock.filter(item =>
      item.itemName?.toLowerCase().includes(query) || 
      item.category?.toLowerCase().includes(query)
     );
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
    return this.grossTotal + this.taxTotal;
  }

  get grossTotal(): number {
    return this.itemsInStock.reduce((sum, item) => sum + this.lineTotal(item), 0);
  }
  get taxTotal(): number {
    return this.itemsInStock.reduce((sum, item) => sum + (this.lineTotal(item) * (item.tax/100)), 0)
  }
  get hasSelectedItems(): boolean {
    return this.itemsInStock.some(item => this.getQty(item.itemName) > 0);
  }

  private generateID(): string {
    return 'OP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  save(): void {
    if (!this.hasSelectedItems) {
      this.notificationService.showWarningMsg("This operation has no items selected!")
      return;
    }
    if (this.form.invalid) {
       if (this.form.controls['operationCustomer'].hasError('required'))
         this.notificationService.showErrorMsg("Please enter the customer name");
      return;
    }
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
        tax: item.tax
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
     
    this.notificationService.showSuccessMsg("Operation is saved successfully.");
    setTimeout(() => { this.router.navigate(['/dashboard']) }, 600);

    this.filteredItems=this.searchQuery? this.itemsInStock.filter(item => item.itemName?.toLowerCase().includes(this.searchQuery) ||
                item.category?.toLowerCase().includes(this.searchQuery))
            : [...this.itemsInStock];
    this.router.navigate(['/dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}