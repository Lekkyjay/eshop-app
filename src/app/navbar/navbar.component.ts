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
  shoppingCartItemCount: number

  constructor(public authService: AuthService, private cartService: ShoppingCartService) { }

  async ngOnInit(){
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser)
    let cart$ = (await this.cartService.getCart()).valueChanges()
    cart$.subscribe(cart => {
      this.shoppingCartItemCount = 0
      for (let productId in cart.items) 
        this.shoppingCartItemCount += cart.items[productId].quantity
    })
  }  

}
