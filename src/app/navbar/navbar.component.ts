import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from '../models/app-user';
import { ShoppingCart } from '../models/shopping-cart';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  appUser: AppUser
  cart$: Observable<ShoppingCart>

  constructor(public authService: AuthService, private cartService: ShoppingCartService) { }

  async ngOnInit(){
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser)
    this.cart$ = await this.cartService.getCart()
  }  

}
