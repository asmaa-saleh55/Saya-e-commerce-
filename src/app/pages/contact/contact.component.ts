import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  form = { name: '', email: '', phone:'', message: '' };
  sent = false;

  submit() {
    if(!this.form.name || !this.form.email || !this.form.phone || !this.form.message) return;
    this.sent = true;
    setTimeout(() => {
      this.sent = false;
      this.form = { name: '', email: '', phone:'', message: '' };
    }, 2500);
  }
}