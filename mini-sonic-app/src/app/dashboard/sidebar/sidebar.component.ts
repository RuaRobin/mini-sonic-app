import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})


export class SidebarComponent {

  navItems: NavItem[] = [
    { label: 'Home', icon: 'home', route: '/dashboard/home' },
    { label: 'Operations', icon: 'category', route: '/dashboard/category' },
    { label: 'Stock', icon: 'stock.png', route: '/dashboard/stock' },
    { label: 'Items', icon: 'shopping_cart', route: '/dashboard/items-list' }]

constructor(private router  : Router){
  
}

isActive(route : string): boolean{
  return this.router.url === route;
}


  }
