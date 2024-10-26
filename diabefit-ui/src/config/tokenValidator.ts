type TokenManager = {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
};

export const isTokenExpired = (token: TokenManager): boolean => {
  const now = Date.now();
  return token.expirationTime < now;
};
