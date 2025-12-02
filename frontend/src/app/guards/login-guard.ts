import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('jwt_token');

  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return true; 
    }

    return router.createUrlTree(['/dashboard']);
  } catch {
    return true;
  }
};
