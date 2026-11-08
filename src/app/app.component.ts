import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './pages/footer/footer.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'saya';

  // للهيدر الجديد
  showMenu = false;
  wishlist: number[] = []; // هيتملي من صفحة الشوب بعد كده
  cartCount = 0;

  constructor(public auth: AuthService, private cartService: CartService) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  // عشان المنيو يقفل لما تدوسي بره
  closeMenu() {
    this.showMenu = false;
  }
}

