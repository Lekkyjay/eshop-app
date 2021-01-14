import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$: Observable<any[]>;
  product:any = {}
  id;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories().snapshotChanges()
      .pipe(
        map(changes => 
          changes.map(change => ({ $key: change.payload.key, ...change.payload.val() })))
      );
      
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.productService.get(this.id)
      .valueChanges()
      .pipe(take(1))    //Take(1) automatically completes Observable. No need to unsubscribe.
      .subscribe(p => this.product = p);
  }

  save(product) { 
    if (this.id) this.productService.update(this.id, product);
    else this.productService.create(product);
    this.router.navigate(['/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }

}
