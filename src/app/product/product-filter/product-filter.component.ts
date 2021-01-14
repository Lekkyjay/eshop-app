import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {

  categories$;
  @Input('category') category;

  constructor(private catService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.catService.getAll().snapshotChanges().pipe(
      map(categories => 
        categories.map(category => (
          { key: category.payload.key, ...category.payload.val() }
        ))
      )
    )
  }

}
