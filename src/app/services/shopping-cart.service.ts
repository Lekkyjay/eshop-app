import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartItem } from '../models/shopping-cart-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() { 
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  async getCart() : Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId()
    return this.db.object<ShoppingCart>('shopping-carts/' + cartId).snapshotChanges()
    .pipe(map(x => new ShoppingCart(x.payload.exportVal().items)))
  }
  
  // async getCart() : Promise<Observable<ShoppingCart>> {
  //   let cartId = await this.getOrCreateCartId()
  //   return this.db.object<ShoppingCart>('shopping-carts/' + cartId).valueChanges().pipe(
  //     map(x => new ShoppingCart(x.items))
  //   )
  // }

  private getCartItem(cartId: string, productId: string) {
    return this.db.object<ShoppingCartItem>('shopping-carts/' + cartId + '/items/' + productId)
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId')
    if (cartId) return cartId

    let result = await this.create()
    localStorage.setItem('cartId', result.key)
    return result.key    
  }

  addToCart(product: Product) {
    this.updateItemQuantity(product, 1)
  }

  removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1)
  }

  private async updateItemQuantity(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId()
    let cartItemRef = this.getCartItem(cartId, product.key)

    cartItemRef.valueChanges()
      .pipe(take(1))
      .subscribe(item => {
        cartItemRef.update({ product: product, quantity: (item?.quantity || 0) + change })
      }
    )
  }
}
