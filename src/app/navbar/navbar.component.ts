import { Component, OnInit } from '@angular/core';
import { AppUser } from '../models/app-user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  appUser: AppUser
  
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.appUser$.subscribe(
      appUser => this.appUser = appUser)
  }  

}
