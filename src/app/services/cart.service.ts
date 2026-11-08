import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private get cartKey(): string {
    const user = JSON.parse(localStorage.getItem('saya_user') || 'null');
    return user?.email ? 'saya_cart_${user.email}' : 'saya_cart_GUEST';
  }
  
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadCart());
  cartItems$ = this.cartItems.asObservable();

  private loadCart(): CartItem[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  reloadCart() {
    this.cartItems.next(this.loadCart());
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(item: CartItem) {
    const current = this.cartItems.value;
    const existing = current.find(i => i.id === item.id && i.size === item.size);
    if (existing) {
      existing.quantity += item.quantity;
      this.saveCart([...current]);
    } else {
      this.saveCart([...current, item]);
    }
  }

  updateQty(id: number, size: string, change: number) {
    const updated = this.cartItems.value.map(i => {
      if (i.id === id && i.size === size) {
        return { ...i, quantity: Math.max(1, i.quantity + change) };
      }
      return i;
    });
    this.saveCart(updated);
  }

  removeItem(id: number, size: string) {
    const filtered = this.cartItems.value.filter(i => !(i.id === id && i.size === size));
    this.saveCart(filtered);
  }

  getCart(): CartItem[] { return this.cartItems.value; }
  getTotal(): number { return this.cartItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0); }
  getCount(): number { return this.cartItems.value.reduce((sum, i) => sum + i.quantity, 0); }
  clearCart() { this.saveCart([]); }
}