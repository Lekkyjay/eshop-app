import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Product } from '../models/product';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = []
  filteredProducts: Product[] = []
  categories$;
  category: string;

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService,
    private catService: CategoryService) { }

  ngOnInit(): void {
    this.productService.getAll().valueChanges()
    .pipe(
      switchMap(products => {
        this.products = products
        return this.route.queryParamMap
      })
    )
    .subscribe(params => {
      this.category = params.get('category')

      this.filteredProducts = (this.category) ?
        this.products.filter(p => p.category === this.category) :
        this.products
    })
    

    this.categories$ = this.catService.getAll().snapshotChanges().pipe(
      map(categories => 
        categories.map(category => (
          { key: category.payload.key, ...category.payload.val() }
        ))
      )
    )
    
  }

}
