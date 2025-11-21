import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/usersApi";
import type { User } from "../types/userTypes";
import UserTable from "../components/User/UserTable";
import UserForm from "../components/User/UserForm";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (user: any) => {
    await createUser(user);
    loadUsers();
  };

  const handleUpdate = async (user: any) => {
    await updateUser(user._id, user);
    setEditingUser(null);
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <main className="flex justify-center items-center h-full">
      <section>
        <div>
          <h1 className="text-center text-2xl font-bold mb-4">Users management</h1>

          <UserForm
            initialData={editingUser}
            onSubmit={editingUser ? handleUpdate : handleCreate}
          />

          <hr className="my-4" />

          <UserTable
            users={users}
            onEdit={(user) => setEditingUser(user)}
            onDelete={handleDelete}
          />
        </div>
      </section>
    </main>
  );
};

export default UsersPage;