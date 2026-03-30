import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../login/auth.service";
import { Router } from "@angular/router";
import { Item, ITEMS } from "../../dummydata/items";

@Component({
    selector: 'app-add-item',
    standalone: false,
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.css',
})
export class AddItemComponent implements OnInit {
    form: FormGroup;
    private storageKey: string;

    // All items loaded from storage
    allItems: Item[] = [];
    // Filtered list shown in the table
    filteredItems: Item[] = [];
    searchQuery: string = '';

    categories = ['Canned Goods', 'Fruits & Vegetables', 'Dairy',
         'Beverages', 'Meat', 'Other'];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        const jwt = this.authService.getActiveUser();
        this.storageKey = `items_${jwt.userID}`;

        this.form = this.fb.group({
            itemName: ['', Validators.required],
            category: ['', Validators.required],
            unitPrice: [0.0, [Validators.required, Validators.min(0)]],
            quantity: [1, [Validators.required, Validators.min(1)]],
            tax: [0.0, [Validators.required, Validators.min(0)]],
        });
    }

    ngOnInit(): void {
        const saved = localStorage.getItem(this.storageKey);
        this.allItems = saved ? JSON.parse(saved) : [...ITEMS];
        this.filteredItems = [...this.allItems];
    }

    get lineTotal(): number {
        const qty = this.form.get('quantity')?.value ?? 0;
        const price = this.form.get('unitPrice')?.value ?? 0;
        return qty * price;
    }

    applySearch(event: Event): void {
        const q = (event.target as HTMLInputElement).value.toLowerCase().trim();
        this.searchQuery = q;
        this.filteredItems = this.allItems.filter(item =>
            item.itemName?.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q)
        );
    }

    private generateID(): string {
        return 'ITEM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.allItems));
    }

    save(): void {
        if (this.form.invalid) return;

        const newItem: Item = {
            ItemID: this.generateID(),
            ...this.form.value,
        };

        this.allItems = [...this.allItems, newItem];
        this.filteredItems = this.searchQuery
            ? this.allItems.filter(item =>
                item.itemName?.toLowerCase().includes(this.searchQuery) ||
                item.category?.toLowerCase().includes(this.searchQuery))
            : [...this.allItems];

        this.saveToStorage();
        this.form.reset({ unitPrice: 0, quantity: 1, tax: 0, itemName: '', category: '' });
    }

    removeItem(itemID: string): void {
        this.allItems = this.allItems.filter(i => i.itemID !== itemID);
        this.filteredItems = this.filteredItems.filter(i => i.itemID !== itemID);
        this.saveToStorage();
    }

    cancel(): void {
        this.router.navigate(['/dashboard']);
    }
}