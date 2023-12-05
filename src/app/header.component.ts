import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartButtonComponent } from './cart/cart-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CartButtonComponent],
  template: `
    <header
      class="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 dark:from-gray-900 dark:via-gray-700 dark:to-gray-600 m-0 p-10 relative"
    >
      <form class="ml-auto">
        <input
          [formControl]="search"
          placeholder="search"
          class="bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
        />
        <button
          type="button"
          class="bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
          [routerLink]="'/products'"
          [queryParams]="{ search: this.search.value }"
        >
          Go Shopping!
        </button>
      </form>
      <app-cart-button class="ml-auto" />
    </header>
  `,
  styles: `
  header {
    display: flex;
    align-items:center;
    justify-content: center
  }
  input {
    width: 300px
  }`,
})
export class HeaderComponent {
  protected search = new FormControl('');
}
