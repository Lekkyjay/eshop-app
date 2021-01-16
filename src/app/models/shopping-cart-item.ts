import { Product } from "./product";

export class ShoppingCartItem {
  quantity: number; 
  product: Product;

  get totalPrice() {
    return this.product.price * this.quantity
  }
}
