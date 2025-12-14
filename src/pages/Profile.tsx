import { useAuth } from "../hooks/useAuth";
import User from "../assets/user.svg";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="flex justify-center items-center h-full">
        <section>
          <p className="text-center">You must log in first.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center h-full">
      <section>
        <div className="flex justify-center">
          <img src={User} alt="User" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">User profile</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-left space-y-1">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Lastname:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone ?? "Not set"}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Hobby:</strong> {user.hobby}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      </section>
    </main>
  );
}