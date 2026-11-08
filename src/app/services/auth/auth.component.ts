import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<any>(JSON.parse(localStorage.getItem('saya_user') || 'null'));

  // REGISTER: يسجل يوزر جديد
  register(name: string, email: string, password: string, phone?: string) {
    // هنحفظ كل اليوزرز اللي سجلوا
    let users = JSON.parse(localStorage.getItem('saya_users') || '[]');
    
    // هل الايميل ده موجود قبل كده؟
    if (users.find((u: any) => u.email === email)) {
      alert('الايميل ده متسجل قبل كده!');
      return false;
    }

    const newUser = { name, email, password, phone, memberSince: new Date().getFullYear() };
    users.push(newUser);
    localStorage.setItem('saya_users', JSON.stringify(users));
    localStorage.setItem('saya_user', JSON.stringify(newUser));
    this.user.set(newUser);
    return true;
  }

  // LOGIN: بيشيك بس
  login(email: string, password: string) {
    let users = JSON.parse(localStorage.getItem('saya_users') || '[]');
    let found = users.find((u: any) => u.email === email && u.password === password);

    if (found) {
      localStorage.setItem('saya_user', JSON.stringify(found));
      this.user.set(found);
      return true;
    } else {
      alert('ايميل أو باسورد غلط!');
      return false;
    }
  }

  logout() {
    localStorage.removeItem('saya_user');
    this.user.set(null);
  }
}
