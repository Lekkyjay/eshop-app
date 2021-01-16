import { Product } from "./product";

export class ShoppingCartItem {
  
  constructor(public quantity: number, public product: Product) {}

  get totalPrice() {
    return this.product.price * this.quantity
  }
}
