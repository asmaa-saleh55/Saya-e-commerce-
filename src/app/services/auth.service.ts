import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<any>(JSON.parse(localStorage.getItem('saya_user') || 'null'));

  register(name: string, email: string, password: string, phone?: string): string | null {
    if (!name.trim() || !email.trim() || !password) {
      return 'Complete all fields.';
    }
    if (!email.includes('@')) {
      return 'email is incorrect.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    let users = JSON.parse(localStorage.getItem('saya_users') || '[]');

    if (users.find((u: any) => u.email === email.trim())) {
      return 'this Email already been registered.';
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password,
      phone, // ده اللي هيخلي الفون يظهر في البروفايل
      memberSince: new Date().getFullYear()
    };
    
    users.push(newUser);
    localStorage.setItem('saya_users', JSON.stringify(users));
    localStorage.setItem('saya_user', JSON.stringify(newUser));
    this.user.set(newUser);
    
    // كل يوزر جديد يبدأ فاضي
    localStorage.setItem('saya_wishlist', JSON.stringify([]));
    localStorage.setItem('saya_cart', JSON.stringify([]));
    // واحفظي له مكان لوحده باسمه
    localStorage.setItem('saya_wishlist_${newUser.email}', JSON.stringify([]));
    localStorage.setItem('saya_cart_${newUser.email}', JSON.stringify([]));
  
    return null;
  }

  login(email: string, password: string): string | null {
    if (!email.trim() || !password) {
      return 'Enter your email or password.';
    }
  
    let users = JSON.parse(localStorage.getItem('saya_users') || '[]');
    let found = users.find((u: any) => u.email === email.trim() && u.password === password);
  
    if (!found) {
      return 'email or password is incorrect.';
    }
  
    // 1- احفظي حاجة اليوزر القديم قبل ما تخرجي منه
    const prevUser = JSON.parse(localStorage.getItem('saya_user') || '{}');
    if (prevUser.email) {
      localStorage.setItem('saya_wishlist_${prevUser.email}', localStorage.getItem('saya_wishlist') || '[]');
      localStorage.setItem('saya_cart_${prevUser.email}', localStorage.getItem('saya_cart') || '[]');
    }
  
    // 2- دخلي اليوزر الجديد
    localStorage.setItem('saya_user', JSON.stringify(found));
    this.user.set(found);

    // 3- حملي حاجته هو بس، لو اول مرة هتبقى فاضية
    const myWishlist = localStorage.getItem('saya_wishlist_${found.email}') || '[]';
    const myCart = localStorage.getItem('saya_cart_${found.email}') || '[]';
    localStorage.setItem('saya_wishlist', myWishlist);
    localStorage.setItem('saya_cart', myCart);


    window.location.reload();
    return null;
  }

  logout() {
    // احفظي حاجته قبل ما تخرجي
    const current = JSON.parse(localStorage.getItem('saya_user') || '{}');
    if (current.email) {
      localStorage.setItem('saya_wishlist_${current.email}', localStorage.getItem('saya_wishlist') || '[]');
      localStorage.setItem('saya_cart_${current.email}', localStorage.getItem('saya_cart') || '[]');
    }
    localStorage.removeItem('saya_user');
    this.user.set(null);
    window.location.reload();
  }
}