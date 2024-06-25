import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product, ProductStore } from './product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { CardComponent } from './card.component';
import { FormControl } from '@angular/forms';
import { filter, finalize } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CardComponent],
  template: `
    <div class="border-b-2 border-indigo-500 text-right m-2">
      <select name="sort by" id="productSort" [formControl]="sortBy">
        <option value="alphabetically">alphabetically</option>
        <option value="price-asc">lowest price</option>
        <option value="price-des">highest price</option>
      </select>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      @for (product of products(); track product.id) {
        <app-product-card
          [product]="product"
          (addToCart)="addToCart($event)"
          #productCard
          [ngModel]=""
        ></app-product-card>
        {{ productCard.product }}
      }
    </div>
    <nav aria-label="Page navigation example" class="flex m-1 justify-center">
      <div class="inline-flex -space-x-px text-base h-10">
        <span
          (click)="decresePage()"
          class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Previous</span
        >
        <span
          aria-current="page"
          class="flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          >{{ productStore.page() }}</span
        >

        <span
          (click)="incresePage()"
          class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Next</span
        >
      </div>
    </nav>
  `,
  styles: ``,
})
export class ProductListComponent implements OnInit {
  protected productStore = inject(ProductStore);
  sortBy = new FormControl(this.productStore.sort());
  protected cartService = inject(CartService);
  protected products = this.productStore.sortedProducts;
  private activatedRoute = inject(ActivatedRoute);
  private readonly destroy: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.sortBy.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroy))
      .subscribe((sortBy) => this.productStore.setSort(sortBy));

    this.activatedRoute.queryParams
      .pipe(
        finalize(() => this.productStore.setSearch('')),
        takeUntilDestroyed(this.destroy),
      )
      .subscribe((params) => {
        const { search } = params;
        if (search) {
          this.productStore.setSearch(search);
        }
      });
  }

  incresePage() {
    this.productStore.increasePage();
  }

  decresePage() {
    this.productStore.decreasePage();
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }
}
