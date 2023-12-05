import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    <button
      type="button"
      class="relative bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
      [routerLink]="'/cart'"
    >
      @if (cartService.length > 0) {
        <div
          class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500  border-white rounded-full -top-2 -end-2 dark:border-gray-900"
        >
          {{ cartService.length }}
        </div>
      }
      Cart
    </button>
  `,
  styles: ``,
})
export class CartButtonComponent {
  protected cartService = inject(CartService);
}
