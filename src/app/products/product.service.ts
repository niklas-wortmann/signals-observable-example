import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, of, pipe, switchMap, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

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
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({
    page: 1,
    sort: 'alphabetically',
    search: '',
    selectedProduct: undefined,
    selectedProductId: '',
    products: [],
  } as {
    page: number;
    sort: ProductSort;
    search: string;
    selectedProduct: Product | undefined;
    selectedProductId: string;
    products: Product[];
  }),
  withComputed(({ products, sort, search, page }) => {
    return {
      sortedProducts: computed(() => {
        const sortBy = sort();
        return [...products()].sort((a, b) => {
          if (sortBy === 'alphabetically') {
            return a.title.localeCompare(b.title);
          } else if (sortBy === 'price-asc') {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });
      }),
      pageAndSort: computed(() => ({
        search: search(),
        page: page(),
      })),
    };
  }),
  withMethods((state) => {
    const httpClient = inject(HttpClient);
    const itemsPerPage = 8;
    return {
      setSelectedProduct(productId: string): void {
        patchState(state, { selectedProductId: productId });
      },
      setSort(sort: ProductSort): void {
        patchState(state, { sort });
      },
      increasePage() {
        patchState(state, { page: state.page() + 1 });
      },
      decreasePage() {
        patchState(state, { page: state.page() - 1 });
      },
      setSearch(search: string): void {
        patchState(state, { search });
      },
      getProducts: rxMethod<{
        page: number;
        search: string;
      }>(
        pipe(
          switchMap(({ page, search }) => {
            const skip = itemsPerPage * (page - 1);
            return httpClient
              .get<Products>(
                `https://dummyjson.com/products/search?limit=${itemsPerPage}&skip=${skip}&q=${search}`,
              )
              .pipe(
                catchError((x) =>
                  of({
                    products: [],
                    total: 0,
                    skip: skip,
                    limit: itemsPerPage,
                  } as Products),
                ),
              );
          }),
          tap((_products) => {
            const products = _products.products;
            patchState(state, { products });
          }),
        ),
      ),
      getProduct: rxMethod<string>(
        pipe(
          filter((id) => !!id),
          switchMap((id) =>
            httpClient
              .get<Product>(`https://dummyjson.com/products/${id}`)
              .pipe(catchError((e) => of(undefined))),
          ),
          tap((product) => patchState(state, { selectedProduct: product })),
        ),
      ),
    };
  }),
  withHooks({
    onInit({ getProduct, selectedProductId, getProducts, pageAndSort }) {
      getProduct(selectedProductId);
      getProducts(pageAndSort);
    },
  }),
);

export const Product1Store = signalStore(
  { providedIn: 'root' },
  withMethods(() => {
    return {
      increasePage: () => undefined,
    };
  }),
);
