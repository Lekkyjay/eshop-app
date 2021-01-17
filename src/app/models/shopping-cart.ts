import { Product } from "./product";
import { ShoppingCartItem } from "./shopping-cart-item";

export class ShoppingCart {

  private items: ShoppingCartItem[] = []    //used below to calculate total price
  
  constructor(private itemsMap: { [productId: string]: ShoppingCartItem }) {
    this.itemsMap = itemsMap || {}    //itemsMap is an object of object/objects or empty object

    for (let productId in itemsMap) {
      let item = itemsMap[productId]  //cart item object from database
      this.items.push(new ShoppingCartItem({key: productId, ...item}))
    }    
  }

  get totalPrice() {
    let sum = 0;
    for (let productId in this.items) 
      sum += this.items[productId].totalPrice;
    return sum;
  }

  get totalItemsCount() {
    let count = 0
    for (let productId in this.itemsMap) 
      count += this.itemsMap[productId].quantity
    return count
  }

  getQuantity(product: Product) {
    let item = this.itemsMap[product.key]
    return item ? item.quantity : 0
  }
}

export interface ItemsMap {
  itemsMap: { [productId: string]: ShoppingCartItem }
}
