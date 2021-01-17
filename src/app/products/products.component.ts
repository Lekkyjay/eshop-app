import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { ProductService } from '../services/product.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = []
  filteredProducts: Product[] = []
  category: string;
  cart$: Observable<ShoppingCart>;
  
  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService, 
    private cartService: ShoppingCartService) { }

  async ngOnInit() {
    this.cart$ = await this.cartService.getCart()   
    this.populateProducts() 
  }

  private populateProducts() { 
    this.productService.getAll().snapshotChanges().pipe(
      map(products => 
        products.map(product => ({ key: product.payload.key, ...product.payload.val() }))
      ),
      switchMap(products => {
        // console.log('products:', products)
        this.products = products
        return this.route.queryParamMap
      })
    )
    .subscribe(params => {
      this.category = params.get('category')
      this.applyFilter();
    })   
  }

  private applyFilter() { 
    this.filteredProducts = (this.category) ? 
    this.products.filter(p => p.category === this.category) : 
    this.products;
  }
}
