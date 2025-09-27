interface ResponseInterface {
  success: boolean;
  message: string;
}

export interface SecurityStoreInterface {
  // Types
  isAuthenticated: boolean;
  latestLoginFootprint: Date | null;

  // Actions
  validateAuth: () => ResponseInterface;
  login: (password: string) => Promise<ResponseInterface>;
  logout: () => ResponseInterface;
  lock: () => ResponseInterface;
}
