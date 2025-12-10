export interface UserProfile {
  id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  phone: number | string;
  location: string;
  hobby: string;
  created_at?: string;
  is_active?: boolean;
}