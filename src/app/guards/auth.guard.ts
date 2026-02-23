import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser;
  const userRole = currentUser?.role;

  const allowedRoles: string[] = route.data['roles'] ?? [];

  // Not logged in
  if (allowedRoles.length > 0 && !userRole) {
    router.navigate(['/']);
    return false;
  }

  // Logged in but not allowed
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
