import { Component, inject, Input, OnInit } from '@angular/core';
import { Product, ProductService } from './product.service';
import {
  AsyncPipe,
  CurrencyPipe,
  JsonPipe,
  NgOptimizedImage,
} from '@angular/common';
import { Observable, of } from 'rxjs';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [JsonPipe, AsyncPipe, NgOptimizedImage, CurrencyPipe],
  template: `@if (product$ | async; as product) {
      <div class="bg-gray-100 dark:bg-gray-800 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row -mx-4">
            <div class="md:flex-1 px-4">
              <div
                class="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4"
              >
                <img
                  class="w-full h-full"
                  width="460"
                  height="460"
                  [ngSrc]="product.thumbnail"
                  alt="Product Image"
                />
              </div>
              <div class="flex -mx-2 mb-4">
                <div class="w-1/2 px-2">
                  <button
                    (click)="addToCart(product)"
                    class="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    Add to Cart
                  </button>
                </div>
                <div class="w-1/2 px-2">
                  <button
                    disabled
                    class="cursor-not-allowed w-full bg-gray-200 dark:bg-gray-300 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold "
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
            <div class="md:flex-1 px-4">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {{ product.title }}
              </h2>
              <div class="flex mb-4">
                <div class="mr-4">
                  <span class="font-bold text-gray-700 dark:text-gray-300"
                    >Price:</span
                  >
                  <span class="text-gray-600 dark:text-gray-300">{{
                    product.price | currency
                  }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300"
                    >Availability:</span
                  >
                  <span class="text-gray-600 dark:text-gray-300">{{
                    product.stock > 0 ? 'In Stock' : 'Not Available'
                  }}</span>
                </div>
              </div>
              <div>
                <span class="font-bold text-gray-700 dark:text-gray-300"
                  >Product Description:</span
                >
                <p class="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {{ product.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <span>loading product or it does not exist</span>
    } `,
  styles: ``,
})
export class ProductComponent implements OnInit {
  @Input() id = '';

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  protected product$: Observable<undefined | Product> = of(undefined);

  ngOnInit(): void {
    this.product$ = this.productService.getProduct(this.id);
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }
}
