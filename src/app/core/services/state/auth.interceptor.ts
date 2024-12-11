import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Notiflix from 'notiflix';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Obtén el token desde localStorage o alguna fuente de estado
  const accessToken = localStorage.getItem('accessToken');

  // Si existe el token, agrega el encabezado Authorization
  const clonedRequest = accessToken
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        console.log("Entra en el interceptor", router.url !== '/login', router.url);
        // Redirige al login si el código de error es 401 o 403
        if (router.url !== '/login') {
          Notiflix.Report.failure(
            'Sesión expirada',
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            'OK',
            () => {
              // Callback después de que el usuario confirma
              router.navigate(['/login']);
            }
          );
        }
      }
      return throwError(() => error);
    })
  );
};
