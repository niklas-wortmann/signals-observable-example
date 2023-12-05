import { Injectable } from '@angular/core';
import { Product } from '../products/product.service';
import { BehaviorSubject, map } from 'rxjs';

export type CartItem = Product & { count: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSub = new BehaviorSubject<Record<string, CartItem>>({});

  public items$ = this.itemsSub
    .asObservable()
    .pipe(map((x) => Object.values(x)));

  public sum$ = this.items$.pipe(
    map((x) => x.reduce((acc, curr) => acc + curr.count * curr.price, 0)),
  );

  add(product: Product) {
    const currentCart = this.itemsSub.value;
    const itemAlreadyInCart = !!currentCart[product.id];
    if (itemAlreadyInCart) {
      const itemInCart = currentCart[product.id];
      this.itemsSub.next({
        ...currentCart,
        [product.id]: { ...itemInCart, count: itemInCart.count + 1 },
      });
    } else {
      this.itemsSub.next({
        ...currentCart,
        [product.id]: { ...product, count: 1 },
      });
    }
  }

  public get length() {
    return Object.values(this.itemsSub.value).reduce(
      (acc, curr) => acc + curr.count,
      0,
    );
  }

  changeAmount(item: CartItem, number: number) {
    if (number <= 0) {
      this.deleteItem(item);
    } else {
      this.itemsSub.next({
        ...this.itemsSub.value,
        [item.id]: { ...this.itemsSub.value[item.id], count: number },
      });
    }
  }

  private deleteItem(item: CartItem) {
    const items = this.itemsSub.value;
    delete items[item.id];
    this.itemsSub.next(items);
  }
}
