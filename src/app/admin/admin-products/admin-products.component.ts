import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchKey: string
  
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
        this.listData.paginator = this.paginator;
      })
      
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
