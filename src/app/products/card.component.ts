import {Component, computed, EventEmitter, input, Output} from '@angular/core';
import {Product} from './product.service';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, CurrencyPipe],
  template: `
    @if (product(); as product) {
      <a
        [routerLink]="productLink()"
        class="h-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 min hover:dark:bg-gray-500 flex justify-between flex-col"
      >
        <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
          <img
            class="rounded-t-lg"
            fill
            priority
            [ngSrc]="product.thumbnail"
            [attr.alt]="productAltText()"
          />
        </div>

        <span
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ product.title }}
        </span>
        <p
          class="mb-3 font-normal text-gray-700 dark:text-gray-400 text-ellipsis"
          style="height: 120px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;"
        >
          {{ product.description }}
        </p>
        <div class="flex justify-between items-center">
          <button
            (click)="add($event, product)"
            class="bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
          >
            Add to Cart
          </button>
          <p class="font-normal text-indigo-500 dark:text-gray-400 text-right ">
            {{ product.price | currency }}
          </p>
        </div>
      </a>
    }
  `,
  styles: ``,
})
export class CardComponent {
  product = input.required<Product>();
  @Output() public addToCart = new EventEmitter<Product>();

  protected productLink = computed(() => {
    return './' + this.product().id;
  });

  protected productAltText = computed(() => {
    return this.product().title + 'thumbnail';
  });

  add(event: MouseEvent, product: Product) {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(product);
  }
}
