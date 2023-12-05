import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product, ProductService } from './product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { CardComponent } from './card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, finalize } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CardComponent, ReactiveFormsModule],
  template: `
    <div class="border-b-2 border-indigo-500 text-right m-2">
      <select name="sort by" id="productSort" [formControl]="sortBy">
        <option value="alphabetically">alphabetically</option>
        <option value="price-asc">lowest price</option>
        <option value="price-des">highest price</option>
      </select>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      @for (product of (products$ | async)?.products; track product.id) {
        <app-product-card
          [product]="product"
          (addToCart)="addToCart($event)"
        ></app-product-card>
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
          >{{ productService.page$ | async }}</span
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
  protected productService = inject(ProductService);
  protected cartService = inject(CartService);
  private activatedRoute = inject(ActivatedRoute);

  protected products$ = this.productService.products$;
  private readonly destroy: DestroyRef = inject(DestroyRef);
  sortBy = new FormControl(this.productService.getCurrentSortValue());

  ngOnInit(): void {
    this.sortBy.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroy))
      .subscribe((sortBy) => this.productService.setSortValue(sortBy));

    this.activatedRoute.queryParams
      .pipe(
        finalize(() => this.productService.setSearchQuery('')),
        takeUntilDestroyed(this.destroy),
      )
      .subscribe((params) => {
        const { search } = params;
        if (search) {
          this.productService.setSearchQuery(search);
        }
      });
  }

  incresePage() {
    this.productService.increasePage();
  }

  decresePage() {
    this.productService.decreasePage();
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }
}
