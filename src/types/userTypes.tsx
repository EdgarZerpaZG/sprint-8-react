export interface User {
  _id?: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  location: string;
}
export interface PropsTable {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}
export interface PropsForm {
  initialData?: User | null;
  onSubmit: (user: User) => void;
}

export interface UserAuth {
  id: string;
  email: string;
  username?: string;
}