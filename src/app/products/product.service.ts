import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export type Products = {
  products: Array<Product>;
  total: number;
  skip: number;
  limit: number;
};

export type ProductSort = 'alphabetically' | 'price-asc' | 'price-desc';

/**
 * https://dummyjson.com/docs/products
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly itemsPerPage = 8;

  private httpClient = inject(HttpClient);
  private search = new BehaviorSubject('');

  private sortSub = new BehaviorSubject<ProductSort>('alphabetically');
  private paginationSub = new BehaviorSubject(1);

  public page$ = this.paginationSub.asObservable();

  public products$ = this.page$.pipe(
    switchMap((page) =>
      this.getProducts(page).pipe(
        switchMap((products) => {
          return this.sortSub.asObservable().pipe(
            map((sortBy) => {
              const prods = products?.products ?? [];
              return {
                ...products,
                products: [...prods].sort((a, b) => {
                  if (sortBy === 'alphabetically') {
                    return a.title.localeCompare(b.title);
                  } else if (sortBy === 'price-asc') {
                    return a.price - b.price;
                  } else {
                    return b.price - a.price;
                  }
                }),
              };
            }),
          );
        }),
      ),
    ),
  );

  public getCurrentSortValue() {
    return this.sortSub.value;
  }

  public setSortValue(sortBy: ProductSort) {
    this.sortSub.next(sortBy);
  }

  public getProducts(page: number) {
    const skip = this.itemsPerPage * (page - 1);
    return this.search.pipe(
      switchMap((search) => {
        return this.httpClient
          .get<Products>(
            `https://dummyjson.com/products/search?limit=${this.itemsPerPage}&skip=${skip}&q=${search}`,
          )
          .pipe(
            catchError((x) =>
              of({
                products: [],
                total: 0,
                skip: skip,
                limit: this.itemsPerPage,
              } as Products),
            ),
          );
      }),
    );
  }

  increasePage() {
    this.paginationSub.next(this.paginationSub.value + 1);
  }

  decreasePage() {
    this.paginationSub.next(this.paginationSub.value - 1);
  }

  getProduct(id: string) {
    return this.httpClient
      .get<Product>(`https://dummyjson.com/products/${id}`)
      .pipe(catchError((e) => of(undefined)));
  }

  setSearchQuery(query: string) {
    this.search.next(query);
  }
}
