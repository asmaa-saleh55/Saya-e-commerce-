import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  total: number = 0;

  constructor(private fb: FormBuilder, private cartService: CartService) {}

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      governorate: ['', [Validators.required]],
      payment: ['cod'],
      // دول بتوع الفيزا
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: ['']
    });

    // لما تغيري طريقة الدفع
    this.checkoutForm.get('payment')?.valueChanges.subscribe(val => {
      const cardNumber = this.checkoutForm.get('cardNumber');
      const cardExpiry = this.checkoutForm.get('cardExpiry');
      const cardCvv = this.checkoutForm.get('cardCvv');
      
      if(val === 'card') {
        cardNumber?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
        cardExpiry?.setValidators([Validators.required]);
        cardCvv?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]);
      } else {
        cardNumber?.clearValidators();
        cardExpiry?.clearValidators();
        cardCvv?.clearValidators();
        cardNumber?.setValue('');
        cardExpiry?.setValue('');
        cardCvv?.setValue('');
      }
      cardNumber?.updateValueAndValidity();
      cardExpiry?.updateValueAndValidity();
      cardCvv?.updateValueAndValidity();
    });

    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  get f() { return this.checkoutForm.controls; }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    console.log(this.checkoutForm.value);
    alert('Order Placed! ' + this.total + ' L.E');
  }
}
