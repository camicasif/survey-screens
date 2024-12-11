import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const accessToken = localStorage.getItem('accessToken'); // Reemplazar con tu servicio si es necesario

  if (accessToken) {
    return true; // Permitir el acceso si existe el token
  } else {
    router.navigate(['/login']); // Redirigir al login si no hay token
    return false;
  }
};
