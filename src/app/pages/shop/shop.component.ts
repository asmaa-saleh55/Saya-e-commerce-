import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  sizes = ['XS', 'S', 'M', 'L', 'XL'];
  colors = [
    { name: 'Sage', hex: '#9CAF9A', count: 3 },
    { name: 'Oat', hex: '#E8DDD0', count: 1 },
    { name: 'Cream', hex: '#F5F0E6', count: 4 },
    { name: 'Black', hex: '#1A1A1A', count: 2 },
    { name: 'Natural', hex: '#EAE5DE', count: 2 },
    { name: 'Cocoa', hex: '#A67C52', count: 2 },
    { name: 'Rust', hex: '#8B5E4B', count: 1 },
  ];
  
  categories = ['Linen Apparel', 'Tops', 'Dresses', 'Bottoms', 'Accessories'];

  products = [
    { id: 1, name: 'Linen Button-Up Shirt', price: 74, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', category: 'Tops', color: 'Sage', tag: 'Best Seller' },
    { id: 2, name: 'Linen Wrap Dress', price: 98, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', category: 'Dresses', color: 'Cream', tag: 'New' },
    { id: 3, name: 'Linen Drawstring Trousers', price: 88, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', category: 'Bottoms', color: 'Natural', tag: '' },
    { id: 4, name: 'Linen Relaxed Shorts', price: 58, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500', category: 'Bottoms', color: 'Sage', tag: '' },
    { id: 5, name: 'Wide-Leg Linen Pants', price: 92, image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500', category: 'Bottoms', color: 'Cream', tag: 'Only 2 left' },
    { id: 6, name: 'Linen Sleeveless Top', price: 56, image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500', category: 'Tops', color: 'Cream', tag: '' },
    { id: 7, name: 'Linen Relaxed Shirt', price: 74, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', category: 'Tops', color: 'Natural', tag: '' },
    { id: 8, name: 'Oversized Linen Blazer', price: 128, image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500', category: 'Linen Apparel', color: 'Black', tag: '' },
    { id: 9, name: 'Pleated Linen Trousers', price: 88, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', category: 'Bottoms', color: 'Cocoa', tag: '' },
    { id: 10, name: 'Basic Linen Tank Top', price: 38, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', category: 'Tops', color: 'Sage', tag: '' },
    { id: 11, name: 'Linen Straight Pants', price: 82, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc560c2?w=500', category: 'Bottoms', color: 'Black', tag: '' },
    { id: 12, name: 'Ruffled Linen Top', price: 70, image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500', category: 'Tops', color: 'Rust', tag: '' },
  ];

  filteredProducts: any[] = [];
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  selectedSizes: string[] = ['S'];
  priceRange = 130;
  maxPrice = 130;
  sortByOption = 'Featured';
  showSort = false;

  currentPage = 1;
  productsPerPage = 6;
  totalPages = 1;

  wishlist: number[] = [];
  showCartModal = false;
  modalProduct: any = null;
  selectedSizeModal = 'M';
  selectedColorModal: any = null;
  
  constructor(private cartService: CartService){}

  private getWishlistKey(): string {
    const saved = localStorage.getItem('saya_user') || localStorage.getItem('user') || 'null';
    const user = JSON.parse(saved);
    return user?.email ? 'saya_wishlist_${user.email}' : 'saya_wishlist_GUEST';
  }
  
  private getWishlistProductsKey(): string {
    const saved = localStorage.getItem('saya_user') || localStorage.getItem('user') || 'null';
    const user = JSON.parse(saved);
    return user?.email ? 'wishlistProducts_${user.email}' : 'wishlistProducts_GUEST';
  }
  ngOnInit() {
    this.wishlist = JSON.parse(localStorage.getItem(this.getWishlistKey()) || '[]');
    this.selectedColorModal = this.colors[0];
    this.applyFilters();
  }
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    return this.filteredProducts.slice(start, start + this.productsPerPage);
  }
  get pagesArray() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  get isAllSelected() { return this.selectedCategories.length === 0 && this.selectedColors.length === 0; }

  selectAll() {
    this.selectedCategories = [];
    this.selectedColors = [];
    this.selectedSizes = ['S'];
    this.priceRange = this.maxPrice;
    this.applyFilters();
  }

  toggleCategory(cat: string) {
    if (this.selectedCategories.includes(cat)) {
      this.selectedCategories = [];
    } else {
      this.selectedCategories = [cat];
    }
    this.applyFilters();
  }

  toggleColor(colorName: string) {
    if (this.selectedColors.includes(colorName)) {
      this.selectedColors = [];
    } else {
      this.selectedColors = [colorName];
    }
    this.applyFilters();
  }

  toggleSize(size: string) {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    } else {
      this.selectedSizes = [size];
    }
  }

  applyFilters() {
    let result = [...this.products];
    if (this.selectedCategories.length > 0) {
      result = result.filter(p => this.selectedCategories.some(c => p.category.toLowerCase().includes(c.toLowerCase().split(' ')[0]) || c.toLowerCase().includes(p.category.toLowerCase())));
    }
    if (this.selectedColors.length > 0) {
      result = result.filter(p => this.selectedColors.includes(p.color));
    }
    result = result.filter(p => p.price <= this.priceRange);
    if (this.sortByOption === 'Price: Low to High') result.sort((a,b) => a.price - b.price);
    if (this.sortByOption === 'Price: High to Low') result.sort((a,b) => b.price - a.price);
    this.filteredProducts = result;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage) || 1;
    this.currentPage = 1;
  }
  clearAllFilters() { this.selectAll(); }
  sort(type: string) { this.sortByOption = type; this.showSort = false; this.applyFilters(); }
  goToPage(page: number) { if (page >= 1 && page <= this.totalPages) { this.currentPage = page; window.scrollTo({ top: 0, behavior: 'smooth' }); } }
  nextPage() { if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1); }
  prevPage() { if (this.currentPage > 1) this.goToPage(this.currentPage - 1); }

  toggleWishlist(product: any, event: Event) {
    event.stopPropagation();
    if (this.wishlist.includes(product.id)) {
      this.wishlist = this.wishlist.filter(id => id !== product.id);
    } else {
      this.wishlist.push(product.id);
    }
    localStorage.setItem(this.getWishlistKey(), JSON.stringify(this.wishlist));
    const wishlistProducts = this.products.filter(p => this.wishlist.includes(p.id));
    localStorage.setItem(this.getWishlistProductsKey(), JSON.stringify(wishlistProducts));
  }
  isWishlisted(id: number) { return this.wishlist.includes(id); }

  openCartModal(product: any, event?: Event) {
    if(event) event.stopPropagation();
    this.modalProduct = product;
    this.selectedSizeModal = this.selectedSizes.length > 0 ? this.selectedSizes[0] : 'S';
    if(this.selectedColors.length > 0) {
      const selectedColorName = this.selectedColors[0];
      const found = this.colors.find(c => c.name === selectedColorName);
      this.selectedColorModal = found || this.colors[0];
    } else {
      this.selectedColorModal = this.colors[0];
    }
    this.showCartModal = true;
  }
  confirmAddToCart() {
    if (!this.modalProduct) return;
    this.cartService.addToCart({
      id: this.modalProduct.id,
      name: this.modalProduct.name,
      price: this.modalProduct.price,
      image: this.modalProduct.image,
      quantity: 1,
      size: this.selectedSizeModal,
      color: this.selectedColorModal?.name || this.modalProduct.color
    })
    const orders = JSON.parse(localStorage.getItem('myOrders') || '[]');
    const cartItem = {
      ...this.modalProduct,
      selectedSize: this.selectedSizeModal,
      selectedColor: this.selectedColorModal,
      cartId: this.modalProduct.id + '-' + this.selectedSizeModal + '-' + Date.now(),
      orderDate: new Date().toLocaleDateString(),
      status: 'Processing'
    };
    orders.push(cartItem);
    localStorage.setItem('myOrders', JSON.stringify(orders));
    this.showCartModal = false;
  }
  closeModal() { this.showCartModal = false; }
}