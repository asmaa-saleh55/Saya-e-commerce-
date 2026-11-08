import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service'; 

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  avatarUrl: string | null = null;
  activeTab: 'profile' | 'orders' | 'wishlist' | 'addresses' = 'profile';
  
  cartItems: any[] = [];
  wishlistItems: any[] = [];
  orders: any[] = []; 

  governorates = ['Assiut','Cairo','Giza','Alexandria','Sohag','Luxor','Aswan','Minya'];
  citiesMap: any = {
    'Assiut': ['Assiut City', 'Manfalut', 'Dayrut'],
    'Cairo': ['Nasr City', 'Maadi', 'Heliopolis'],
    'Giza': ['Dokki', '6th October', 'Sheikh Zayed']
  };
  filteredCities: string[] = [];

  constructor(private fb: FormBuilder, private router: Router, private cartService: CartService) {}

  private getWishlistKey(): string {
    const user = JSON.parse(localStorage.getItem('saya_user') || 'null');
    return user?.email ? 'saya_wishlist_${user.email}' : 'saya_wishlist_GUEST';
  }

  private getOrdersKey(): string {
    const user = JSON.parse(localStorage.getItem('saya_user') || 'null');
    return user?.email ? 'saya_orders_${user.email}' : 'saya_orders_GUEST';
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dob: [''],
      governorate: [''],
      city: [''],
      address: ['']
    });

    const savedUser = localStorage.getItem('saya_user') || localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.profileForm.patchValue({
        fullName: user.fullName  || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        governorate: user.governorate || '',
        city: user.city || '',
        address: user.address || ''
      });
      this.onGovChange();
    }

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    const productsKey = this.getWishlistKey().replace('saya_wishlist', 'wishlistProducts');
    this.wishlistItems = JSON.parse(
      localStorage.getItem(productsKey) || 
      localStorage.getItem(this.getWishlistKey()) ||
      localStorage.getItem('wishlistProducts') || 
      '[]'
    );
    
    if (this.wishlistItems.length > 0 && typeof this.wishlistItems[0] === 'number') {
      this.wishlistItems = JSON.parse(localStorage.getItem(productsKey) || '[]');
    }

    // الاوردرات كمان لكل يوزر
    this.orders = JSON.parse(localStorage.getItem(this.getOrdersKey()) || '[]');

    this.profileForm.get('governorate')?.valueChanges.subscribe(() => this.onGovChange());
  }

  onGovChange() {
    const gov = this.profileForm.get('governorate')?.value;
    this.filteredCities = this.citiesMap[gov] || [];
  }

  setTab(tab: any) { this.activeTab = tab; }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.avatarUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const current = JSON.parse(localStorage.getItem('saya_user') || '{}');
    const updated = { ...current, ...this.profileForm.value };
    localStorage.setItem('saya_user', JSON.stringify(updated));
    localStorage.setItem('user', JSON.stringify(updated));
    alert('Profile Saved ✨');
  }
  logout() {
    // مبقيناش بنمسح الـ wishlist والـ orders عشان يفضل محفوظ لما يرجع
    localStorage.removeItem('saya_user');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  removeFromWishlist(productId: number) {
    this.wishlistItems = this.wishlistItems.filter((p: any) => p.id !== productId);
    
    // بنحفظ بالمفتاح الخاص باليوزر ده بس
    localStorage.setItem(this.getWishlistKey(), JSON.stringify(this.wishlistItems));
    localStorage.setItem('wishlistProducts', JSON.stringify(this.wishlistItems));
    
    window.dispatchEvent(new Event('storage'));
  }

  goToShop() { this.router.navigate(['/shop']); }
}