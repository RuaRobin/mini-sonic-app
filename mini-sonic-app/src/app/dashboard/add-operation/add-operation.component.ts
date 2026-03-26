import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../login/auth.service';
import { Operation } from '../../dummydata/operation';

@Component({
  selector: 'app-add-operation',
  standalone: false,
  templateUrl: './add-operation.component.html',
  styleUrl: './add-operation.component.css',
})
export class AddOperationComponent {
  form: FormGroup;
  operationTypes = ['Sale', 'Purchase', 'Return', 'Refund'];
  private storageKey: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    const jwt = this.authService.getActiveUser();
    this.storageKey = `operations_${jwt.userID}`;

    this.form = this.fb.group({
      operationType: ['Sale', Validators.required],
      operationCustomer: ['', Validators.required],
      operationDate: [this.todayString(), Validators.required],
      notes: [''],
      items: this.fb.array([this.newItemGroup()]),
    });
  }

  private todayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private newItemGroup(): FormGroup {
    return this.fb.group({
      ItemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.newItemGroup());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
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

  private generateID(): string {
    return 'OP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  save(): void {
    if (this.form.invalid) return;

    const newOperation: Operation = {
      operationID: this.generateID(),
      ...this.form.value,
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