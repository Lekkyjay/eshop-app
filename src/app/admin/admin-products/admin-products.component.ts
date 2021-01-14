import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  // products$: Observable<Product[]>;
  products: Product[]
  subscription: Subscription;
  filteredProducts: any[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // this.products$ = this.productService.getAll().snapshotChanges()
    //   .pipe(
    //     map(products => 
    //       products.map(product => (
    //         { key: product.payload.key, ...product.payload.val() }
    //       ))
    //     )
    //   )

    this.subscription = this.productService.getAll().snapshotChanges()
      .pipe(
        map(products => 
          products.map(product => (
            { key: product.payload.key, ...product.payload.val() }
          ))
        )
      )
      .subscribe(p => this.filteredProducts =this.products = p)
  }


  filter(query: string) { 
    this.filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;

    // this.initializeTable(filteredProducts);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
