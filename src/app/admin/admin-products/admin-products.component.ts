import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products: Product[]
  subscription: Subscription;
  
  displayedColumns: string[] = ['title', 'price', 'edit'];
  listData: MatTableDataSource<Product>;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.subscription = this.productService.getAll().snapshotChanges()
      .pipe(
        map(products => 
          products.map(product => (
            { key: product.payload.key, ...product.payload.val() }
          ))
        )
      )
      .subscribe(p => {
        this.listData = new MatTableDataSource(p);
        this.listData.sort = this.sort;
      })
      
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
