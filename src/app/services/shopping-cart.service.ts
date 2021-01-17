import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartItem } from '../models/shopping-cart-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart() : Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId()
    return this.db.object<ShoppingCart>('shopping-carts/' + cartId).snapshotChanges()
    .pipe(
      // tap(x => console.log('getCart:', x)),
      // tap(x => console.log('getCart items:', x.payload.exportVal().items)),
      // tap(x => console.log('getCart numChildren:', x.payload.numChildren())),
      map(x => new ShoppingCart(x.payload.exportVal().items))
    )
  }

  addToCart(product: Product) {
    this.updateItem(product, 1)
  }

  removeFromCart(product: Product) {
    this.updateItem(product, -1)
  }

  async clearCart() { 
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }
  
  private create() { 
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

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

  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId()
    let cartItemRef = this.getCartItem(cartId, product.key)

    cartItemRef.valueChanges()
      .pipe(take(1))
      .subscribe(item => {
        let quantity = (item?.quantity || 0) + change
        if (quantity === 0) cartItemRef.remove()
        else cartItemRef.update({ 
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: quantity })
      }
    )
  }
}
