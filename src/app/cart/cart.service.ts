import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../products/product.service';

export type CartItem = Product & { count: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSignal = signal<Record<string, CartItem>>({});

  public items = computed(() => {
    const items = this.itemsSignal();
    return Object.values(items);
  });

  public sum = computed(() => {
    return this.items().reduce((acc, curr) => acc + curr.count * curr.price, 0);
  });

  add(product: Product) {
    const currentCart = this.itemsSignal();
    const itemAlreadyInCart = !!currentCart[product.id];
    if (itemAlreadyInCart) {
      const itemInCart = currentCart[product.id];
      this.itemsSignal.set({
        ...currentCart,
        [product.id]: { ...itemInCart, count: itemInCart.count + 1 },
      });
    } else {
      this.itemsSignal.set({
        ...currentCart,
        [product.id]: { ...product, count: 1 },
      });
    }
  }

  public get length() {
    return this.items().reduce((acc, curr) => acc + curr.count, 0);
  }

  changeAmount(item: CartItem, number: number) {
    if (number <= 0) {
      this.deleteItem(item);
    } else {
      this.itemsSignal.set({
        ...this.itemsSignal(),
        [item.id]: { ...this.itemsSignal()[item.id], count: number },
      });
    }
  }

  private deleteItem(item: CartItem) {
    const items = this.itemsSignal();
    delete items[item.id];
    this.itemsSignal.set({ ...items });
  }
}
