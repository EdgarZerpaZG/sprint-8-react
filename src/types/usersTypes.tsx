export interface UserProfile {
  id: string;
  auth_user_id?: string | null;
  created_at?: string;
  username: string;
  email: string;
  name: string;
  lastname: string;
  phone: number | string;
  location: string;
  hobby: string;
  is_active?: boolean;
}

export type UserProfileCreateInput = Omit<
  UserProfile,
  "id" | "created_at"
>;

export type UserProfileUpdateInput = Partial<
  Omit<UserProfile, "id" | "created_at">
>;