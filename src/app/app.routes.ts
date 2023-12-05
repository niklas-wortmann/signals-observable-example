import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-list.component').then(
        (c) => c.ProductListComponent,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./products/product.component').then((c) => c.ProductComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then((c) => c.CartComponent),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
