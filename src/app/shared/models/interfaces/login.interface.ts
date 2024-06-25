export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userPrincipal: UserPrincipal;
  bearer: string;
  token: string;
  authorities: string[];
}

export interface UserPrincipal {
  id_user: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  postalCode: string | null;
  roles: string[];
}
