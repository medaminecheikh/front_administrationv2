export interface CurrentUser {
  username: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}
