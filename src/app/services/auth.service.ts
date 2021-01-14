import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUser } from '../models/app-user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute, 
    private router: Router, 
    private userService: UserService
  ) { 
    this.user$ = this.afAuth.authState
  }

  login() { 
    //snapshot is easier to use. No need tosubscribe to an Observable
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    const provider = new firebase.auth.GoogleAuthProvider()
    this.afAuth.signInWithPopup(provider).then((result) => {
      this.userService.save(result.user)
      this.router.navigateByUrl(returnUrl)
    })
  }

  logout() {
    this.afAuth.signOut();
  }

  //switchMap switches from Observable<firebase.User> to Observable<AppUser>
  get appUser$() : Observable<AppUser> {
    return this.user$
    .pipe(
      switchMap(user => {
        if (user) return this.userService.get(user.uid).valueChanges();
        return of(null);
      })    
    )
  }
}
