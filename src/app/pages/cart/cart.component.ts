import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(public cartService: CartService, private router:Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  increase(item: CartItem) {
    this.cartService.updateQty(item.id, item.size, 1);
  }

  decrease(item: CartItem) {
    this.cartService.updateQty(item.id, item.size, -1);
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item.id, item.size);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}