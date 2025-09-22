import { AuthenticationService } from "@core/_services";
import {inject} from "@angular/core";
export const AuthGuard = () => {
  const authService = inject(AuthenticationService);

  const authToken = authService.isLoggedIn();
  if (authToken) {
    return true;
  } else {
    authService.redirectToLogin();
    return false;
  }
};
