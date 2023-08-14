import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>((observer) => {
      onAuthStateChanged(getAuth(), (user: User | null) => {
        if (user) {
          // Se o usuário está autenticado, permita o acesso à rota
          const userData = {
            uid: user.uid,
            email: user.email,
          }

          localStorage.setItem("@detailUser", JSON.stringify(userData));
          
          observer.next(true);
        } else {
          // Se o usuário não está autenticado, redirecione para a página de login
          this.router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}
