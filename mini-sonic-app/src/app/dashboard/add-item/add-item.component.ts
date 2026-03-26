
import { Component } from "@angular/core";

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../login/auth.service";
import { Router } from "@angular/router";
import { Item } from "../../dummydata/items";

@Component({
    selector: 'app-add-operation',
    standalone: false,
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.css',
})

export class AddItemComponent {
    form: FormGroup;
    private storageKey: string;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        const jwt = this.authService.getActiveUser()
        this.storageKey = `operations_${jwt.userID}`;
        this.form = this.fb.group({
            itemName: ['', Validators.required],
            unitPrice: [0.0, [Validators.required, Validators.min(0)]],
            quantity: [1, [Validators.required, Validators.min(1)]],
            tax: [0.0, [Validators.required, Validators.min(0)]]
        });
    }
lineTotal(): number {
  const qty = this.form.get('quantity')?.value ?? 0;
  const price = this.form.get('unitPrice')?.value ?? 0;
  return qty * price;
}
private generateID(): string {
  return 'ITEM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}
    cancel() : void{
        this.router.navigate(['/dashboard']);
    }

    save(): void{
        if (this.form.invalid)
            return;
        const newItem : Item={
            ItemID: this.generateID(),
            ...this.form.value
        }
const existing: Item[] = JSON.parse(localStorage.getItem(this.storageKey) ?? 'null') ?? [];
   localStorage.setItem(this.storageKey,JSON.stringify([...existing,newItem]));
        this.router.navigate(['/dashboard'])
    }

}