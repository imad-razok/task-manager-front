import { logging } from 'protractor';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { empty, Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class WebReqInterceptor implements HttpInterceptor {

  refreshingAccessToken:boolean;
  accessTokenRefreshed:Subject<any> = new Subject();
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addAuthHeader(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
          return this.refrechAccessToken().pipe(
            switchMap(()=>{
              request=this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err:any)=>{
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )
          //this.authService.logout();
        }
        return throwError(error);
      })
    );
  }

  refrechAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable(observer=>{
        this.accessTokenRefreshed.subscribe(()=>{
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken=true;
      return this.authService.getNewAccessToken().pipe(
        tap(()=>{
          this.refreshingAccessToken=false;
          console.log("Access Token Refreshed");
          this.accessTokenRefreshed.next();
        })
      )
    }


  }

  addAuthHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.authService.getAccessToken();
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    return request;
  }
}
