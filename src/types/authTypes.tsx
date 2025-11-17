export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}